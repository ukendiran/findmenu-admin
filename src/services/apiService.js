import axios from "axios";
import EncryptionService from "./encryptionService";
import { logout } from "../store/slices/authSlice";
import store from "../store";

const apiUrl = import.meta.env.VITE_API_URL;
const siteUrl = import.meta.env.VITE_SITE_URL;
const appUrl = import.meta.env.VITE_APP_URL;
const adminUrl = import.meta.env.VITE_ADMIN_URL;
const manageUrl = import.meta.env.VITE_MANAGE_URL;
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 5000;

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

// Attach token before request
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

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

// Unified API export
export default {
  get: (url, params, config) => API.get(url, { params, ...config }),
  post: (url, data, config) => API.post(url, data, config),
  put: (url, data, config) => API.put(url, data, config),
  delete: (url, data, config) => API.delete(url, { data, ...config }),
  apiUrl,
  siteUrl,
  appUrl,
  adminUrl,
  manageUrl,
};
