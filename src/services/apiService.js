import axios from "axios";
import EncryptionService from "./encryptionService";
import { logout } from "../store/slices/authSlice";
import store from "../store";

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 5000,
});

// Helper: get decrypted token
function getToken() {
  const encrypted = localStorage.getItem("token");
  return encrypted ? EncryptionService.decrypt(encrypted) : null;
}

// REQUEST interceptor: attach Authorization header
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

// RESPONSE interceptor: handle 401 and refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // If 401: try refresh once
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue the request until refresh finished
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // call your refresh endpoint
      return new Promise((resolve, reject) => {
        API.post("/refresh")
          .then(({ data }) => {
            const newToken = data.data.token;
            // store new token
            localStorage.setItem("token", EncryptionService.encrypt(newToken));
            // update Redux state
            store.dispatch(logout()); // or a dedicated refresh action
            // resolve queued requests
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // permanent failure: logout
            store.dispatch(logout());
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // For other errors
    if (status === 500) {
      alert("Server error, please try again later.");
    }

    return Promise.reject(error);
  }
);

export default {
  get: (url, params) => API.get(url, { params }),
  post: (url, data) => API.post(url, data),
  put: (url, data) => API.put(url, data),
  delete: (url, data) => API.delete(url, { data }),
  appUrl: import.meta.env.VITE_APP_URL,
  apiUrl: import.meta.env.VITE_API_BASE_URL,
};
