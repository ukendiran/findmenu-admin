import axios from "axios";


// Base configuration for Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 5000, // Optional: timeout from env or default to 5000ms
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
});

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appUrl = import.meta.env.VITE_APP_URL;


// Define API methods
const siteApiService = {
  get: (url, params) => API.get(url, { params }),
  post: (url, data) => API.post(url, data),
  put: (url, data) => API.put(url, data),
  delete: (url, data) => API.delete(url, { data }),
  appUrl:appUrl,
  apiUrl:apiUrl,
};

export default siteApiService;