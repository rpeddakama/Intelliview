import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, setAuthToken } from "../utils/auth";
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
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            // If /auth/check is not found, we'll assume the token is valid
            // This is a fallback and should be removed once /auth/check is implemented
            console.warn("/auth/check not found, assuming token is valid");
            setIsAuth(true);
          } else {
            console.error("Authentication check failed:", error);
            setAuthToken(null);
            setIsAuth(false);
          }
        }
      } else {
        setIsAuth(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
