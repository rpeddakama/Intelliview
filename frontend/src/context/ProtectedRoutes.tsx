import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists in local storage

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
