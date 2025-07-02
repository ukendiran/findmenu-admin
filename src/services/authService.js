// services/authService.js
import apiService from "./apiService";
import EncryptionService from "./encryptionService";

export async function refreshToken() {
  try {
    // Call your Laravel refresh endpoint
    const response = await apiService.post("/refresh");
    const { token, expires_in } = response.data.data;

    // Store the new token (encrypted) in localStorage
    localStorage.setItem("token", EncryptionService.encrypt(token));

    // Update the default Authorization header so future requests use it
    apiService.defaults.headers.common.Authorization = `Bearer ${token}`;

    return { token, expires_in };
  } catch (err) {
    // If the refresh itself fails, you should log the user out
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw err;
  }
}
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists
}
export function getToken() {
  const token = localStorage.getItem("token");
  return token ? EncryptionService.decrypt(token) : null; // Decrypt the token before returning
}
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login page
}

export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user; // Assuming the user info is stored in the token payload
  } catch (e) {
    console.error("Failed to parse user from token", e);
    return null;
  }
}