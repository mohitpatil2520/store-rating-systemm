import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 1) If user NOT logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) If specific roles are required → check them
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(user.role)) {
      // User role is NOT allowed → redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // 3) User is logged in + has permission → render the page
  return children;
}
