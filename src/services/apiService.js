import axios from "axios";
import EncryptionService from "./encryptionService";

// Base configuration for Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 5000, // Optional: timeout from env or default to 5000ms
});

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appUrl = import.meta.env.VITE_APP_URL;



// Add request interceptor (optional)
API.interceptors.request.use(
  (config) => {
    // Add token or other headers if needed
    const token =EncryptionService.decrypt(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Handle unauthorized error (e.g., redirect to login page or show login modal)
      console.log("Unauthorized. Please log in.");
      // Optionally clear the token
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      // Redirect to login page
      window.location.href = "/login";
    } else if (status === 500) {
      // Server error, display user-friendly message
      alert("An error occurred on the server. Please try again later.");
    } else {
      // Other error handling
      console.error(error.response?.data || "An unknown error occurred.");
    }
    return Promise.reject(error);
  }
);


// Define API methods
const apiService = {
  get: (url, params) => API.get(url, { params }),
  post: (url, data) => API.post(url, data),
  put: (url, data) => API.put(url, data),
  delete: (url, data) => API.delete(url, { data }),
  appUrl:appUrl,
  apiUrl:apiUrl,
};

export default apiService;
