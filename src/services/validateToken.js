import { jwtDecode } from "jwt-decode";
import EncryptionService from "./encryptionService";

const clearLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("config");
};

export const validateToken = () => {
  try {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) {
      console.warn("No token found in localStorage.");
      return false;
    }

    const token = EncryptionService.decrypt(encryptedToken);
    if (!token) {
      console.error("Decryption failed. Invalid token.");
      clearLocalStorage();
      return false;
    }

    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) {
      console.warn("Token does not have an expiration time.");
      clearLocalStorage();
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp <= currentTime) {
      console.warn("Token has expired.");
      clearLocalStorage();
      return false;
    }

    console.log("Valid token");
    return true;
  } catch (error) {
    console.error("Invalid token:", error.message);
    clearLocalStorage();
    return false;
  }
};

export const decryptToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};
