import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const siteUrl = import.meta.env.VITE_SITE_URL;
const appUrl = import.meta.env.VITE_APP_URL;
const adminUrl = import.meta.env.VITE_ADMIN_URL;
const manageUrl = import.meta.env.VITE_MANAGE_URL;
const timeout = import.meta.env.VITE_API_TIMEOUT;

// Base configuration for Axios
const API = axios.create({
  baseURL: apiUrl, // Use environment variable
  timeout: parseInt(timeout, 10) || 5000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
});


// Define API methods
const siteApiService = {
  get: (url, params) => API.get(url, { params }),
  post: (url, data) => API.post(url, data),
  put: (url, data) => API.put(url, data),
  delete: (url, data) => API.delete(url, { data }),
    apiUrl:apiUrl,
    siteUrl:siteUrl,
    appUrl:appUrl,
    adminUrl:adminUrl,
    manageUrl:manageUrl,
};

export default siteApiService;