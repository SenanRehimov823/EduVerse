
import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
