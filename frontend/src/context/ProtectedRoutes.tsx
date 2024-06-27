import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Check if token exists in local storage
  console.log("Is authenticated:", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
