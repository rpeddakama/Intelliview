import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import axiosInstance from "../../axiosConfig";
import { clearAuth } from "../../utils/auth";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
      clearAuth(); // This will clear the token from localStorage and axios headers
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      clearAuth(); // Clear auth even if there's an error
      setIsLoading(false);
      navigate("/login");
    }
  };

  return (
    <span
      onClick={handleLogout}
      style={{
        cursor: "pointer",
        color: "white",
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
    </span>
  );
};

export default Logout;
