import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // Convert ms to seconds
    return decoded.exp < now;
  } catch (err) {
    console.error("Failed to decode token", err);
    return true; // Invalid token → treat as expired
  }
};

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
