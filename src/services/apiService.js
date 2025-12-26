import axios from "axios";
import EncryptionService from "./encryptionService";
import { logout } from "../store/slices/authSlice";
import store from "../store";
import { isCanceledError, shouldLogError, globalRequestTracker } from "../../../shared/utils/requestCancellation";

const apiUrl = import.meta.env.VITE_API_URL;
const siteUrl = import.meta.env.VITE_SITE_URL;
const appUrl = import.meta.env.VITE_APP_URL;
const adminUrl = import.meta.env.VITE_ADMIN_URL;
const manageUrl = import.meta.env.VITE_MANAGE_URL;
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 10000; // Increased to 10 seconds

// Axios instance
const API = axios.create({
  baseURL: apiUrl,
  timeout,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

// Token helper
const getToken = () => {
  const encrypted = localStorage.getItem("token");
  return encrypted ? EncryptionService.decrypt(encrypted) : null;
};

const setToken = (token) => {
  localStorage.setItem("token", EncryptionService.encrypt(token));
};

// Token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// Attach token before request and handle cancellation
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle duplicate request prevention
    if (config.cancelDuplicates && config.method && config.url) {
      const requestId = globalRequestTracker.generateRequestId(
        config.method,
        config.url,
        config.data
      );

      // Cancel duplicate request if in progress
      if (globalRequestTracker.isRequestInProgress(requestId)) {
        globalRequestTracker.cancelRequest(requestId);
      }

      // Create new controller for this request
      if (!config.signal) {
        const controller = new AbortController();
        config.signal = controller.signal;
        globalRequestTracker.addRequest(requestId, controller);
        
        // Store requestId for cleanup
        config._requestId = requestId;
      }
    }

    return config;
  },
  (error) => {
    if (shouldLogError(error)) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Token refresh logic
const refreshToken = () => {
  return API.post("/refresh").then((response) => {
    const newToken = response.data?.data?.token;
    if (!newToken) throw new Error("No new token received");
    setToken(newToken);
    return newToken;
  });
};

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Clean up request tracking
    if (response.config._requestId) {
      globalRequestTracker.removeRequest(response.config._requestId);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Clean up request tracking
    if (originalRequest._requestId) {
      globalRequestTracker.removeRequest(originalRequest._requestId);
    }

    // Don't process canceled requests further
    if (isCanceledError(error)) {
      return Promise.reject(error);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      if (shouldLogError(error)) {
        console.error('Request timeout:', error);
      }
      error.userMessage = 'The request took too long. Please check your connection and try again.';
    }
    // Handle network errors
    else if (error.code === 'ERR_NETWORK' || !error.response) {
      if (shouldLogError(error)) {
        console.error('Network error:', error);
      }
      error.userMessage = 'Unable to connect. Please check your internet connection.';
    }
    // Handle server errors
    else if (status >= 500) {
      if (shouldLogError(error)) {
        console.error('Server error:', error);
      }
      error.userMessage = 'Something went wrong. Please try again later.';
    }
    // Handle client errors (except 401 which is handled below)
    else if (status >= 400 && status !== 401) {
      if (shouldLogError(error)) {
        console.error('Client error:', error);
      }
      error.userMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    }

    const isLoginOrRefresh =
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/refresh");

    if (status === 401 && !originalRequest._retry && !isLoginOrRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      console.warn("Forbidden: Access denied");
    }

    if (status === 500) {
      console.error("Server error, please try again later.");
    }

    return Promise.reject(error);
  }
);

/**
 * Enhanced API methods with cancellation support
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {Object} config - Request configuration
 * @param {AbortSignal} config.signal - AbortSignal for cancellation
 * @param {boolean} config.cancelDuplicates - Whether to cancel duplicate requests
 * @param {number} config.timeout - Request timeout
 */

// Unified API export
export default {
  get: (url, params, config = {}) => API.get(url, { params, ...config }),
  post: (url, data, config = {}) => API.post(url, data, config),
  put: (url, data, config = {}) => API.put(url, data, config),
  delete: (url, data, config = {}) => API.delete(url, { data, ...config }),
  patch: (url, data, config = {}) => API.patch(url, data, config),
  apiUrl,
  siteUrl,
  appUrl,
  adminUrl,
  manageUrl,
};

/**
 * Utility to create a cancelable request
 * @param {Function} requestFn - Function that takes AbortSignal and returns Promise
 * @returns {Object} - Object with promise and cancel function
 */
export function createCancelableRequest(requestFn) {
  const controller = new AbortController();
  
  const promise = requestFn(controller.signal);
  
  const cancel = () => {
    controller.abort();
  };
  
  return { promise, cancel };
}

/**
 * Cancel all pending requests
 */
export function cancelAllRequests() {
  globalRequestTracker.cancelAllRequests();
}
