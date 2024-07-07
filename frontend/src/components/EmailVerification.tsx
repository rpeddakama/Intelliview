import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axiosInstance from "../axiosConfig";

const EmailVerification: React.FC = () => {
  const [verificationStatus, setVerificationStatus] =
    useState<string>("Verifying...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const verificationAttempted = useRef(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    setToken(urlToken);
  }, [location.search]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || verificationAttempted.current) {
        return;
      }

      verificationAttempted.current = true;

      try {
        console.log("Sending verification request...");
        const response = await axiosInstance.get("/auth/verify-email", {
          params: { token },
        });
        console.log("Verification response:", response);
        if (response.data.message === "Email verified successfully") {
          setVerificationStatus("Your email has been successfully verified!");
        } else if (response.data.message === "Email is already verified") {
          setVerificationStatus(
            "Your email has already been verified. You can proceed to login."
          );
        } else {
          setVerificationStatus(
            "Verification failed. Please try again or contact support."
          );
        }
      } catch (error: any) {
        console.error("Error during verification:", error.response || error);
        if (error.response?.data?.message === "Email is already verified") {
          setVerificationStatus(
            "Your email has already been verified. You can proceed to login."
          );
        } else {
          setVerificationStatus(
            "An error occurred during verification. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1E1E1E",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#2C2C2C",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              "&::before": {
                content: '""',
                width: "12px",
                height: "12px",
                backgroundColor: "#8B5CF6",
                borderRadius: "50%",
                marginRight: "8px",
              },
            }}
          >
            Maxview AI
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "#623BFB" }} />
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "white", marginBottom: "24px" }}
            >
              {verificationStatus}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "#623BFB",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#623BFB",
                },
                padding: "10px 0",
              }}
            >
              Go to Login
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default EmailVerification;
