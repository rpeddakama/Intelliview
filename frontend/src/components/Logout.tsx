import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import axiosInstance from "../axiosConfig";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Make a request to the server to invalidate the refresh token
      await axiosInstance.post("/auth/logout");

      // Clear the access token from memory
      axiosInstance.defaults.headers["Authorization"] = "";

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we should still clear the local auth state
      axiosInstance.defaults.headers["Authorization"] = "";
      setIsLoading(false);
      navigate("/login");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="contained"
      color="secondary"
      sx={{
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
    </Button>
  );
};

export default Logout;
