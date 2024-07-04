import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, clearAuth } from "../utils/auth";
import axiosInstance from "../axiosConfig";

const ProtectedRoute: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          await axiosInstance.get("/auth/check");
          setIsAuth(true);
        } catch (error) {
          console.error("Authentication check failed:", error);
          clearAuth(); // Clear auth if check fails
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
