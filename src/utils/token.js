import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  } catch (err) {
    console.error("Failed to decode token", err);
    return true; // If token is invalid or can't decode, treat as expired
  }
};
