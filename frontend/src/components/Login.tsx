import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Snackbar } from "@mui/material";
import axiosInstance from "../axiosConfig";
import { setAuthToken } from "../utils/auth";
import Logo from "../components/ui/Logo";

interface UserProfile {
  email: string;
  accountTier: string;
  isPremium: boolean;
  subscriptionStatus: string;
  subscriptionEndDate: string | null;
  cancelAtPeriodEnd: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      // Login
      const loginResponse = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { accessToken } = loginResponse.data;
      setAuthToken(accessToken);

      // Fetch user profile
      const profileResponse = await axiosInstance.get<UserProfile>(
        "/api/profile"
      );
      const userProfile = profileResponse.data;

      // Check subscription status
      if (userProfile.isPremium) {
        if (userProfile.cancelAtPeriodEnd) {
          const endDate = new Date(userProfile.subscriptionEndDate!);
          setMessage(
            `Your premium subscription will end on ${endDate.toLocaleDateString()}. You can renew it in the profile page.`
          );
        } else {
          setMessage("Welcome back! You're on a premium plan.");
        }
      } else if (userProfile.subscriptionStatus === "canceled") {
        setMessage(
          "Your subscription has ended. Visit the profile page to resubscribe and enjoy premium features!"
        );
      } else {
        setMessage(
          "Welcome! Consider upgrading to our premium plan for additional features."
        );
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (
        error.response?.data?.message ===
        "Please verify your email before logging in"
      ) {
        setError(
          "Please verify your email before logging in. Check your inbox for a verification link."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Login failed. Please check your email and password."
        );
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0D0D1A",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#191925",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Logo width={126} height={30} />
        </Box>

        <TextField
          fullWidth
          variant="filled"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            marginBottom: "16px",
            "& .MuiFilledInput-root": {
              color: "#9090AF",
              backgroundColor: "#20202C",
              "&:hover": {
                backgroundColor: "#20202C",
              },
              "&.Mui-focused": {
                backgroundColor: "#20202C",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
              padding: "12px 12px 12px",
            },
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            marginBottom: "24px",
            "& .MuiOutlinedInput-root": {
              color: "white",
            },
            "& .MuiFilledInput-root": {
              backgroundColor: "#20202C",
              "&:hover": {
                backgroundColor: "#20202C",
              },
              "&.Mui-focused": {
                backgroundColor: "#20202C",
                color: "#9090AF",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
              padding: "12px 12px 12px",
            },
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#623BFB",
            color: "white",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#623BFB",
            },
            marginBottom: "16px",
            padding: "10px 0",
          }}
        >
          Login
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#888", marginBottom: "16px" }}
        >
          Don't have an account?{" "}
          <Button
            color="primary"
            onClick={() => navigate("/register")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              padding: 0,
              minWidth: "auto",
            }}
          >
            Sign up
          </Button>
        </Typography>
      </Box>
      <Snackbar
        open={!!error || !!message}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setMessage(null);
        }}
        message={error || message}
      />
    </Box>
  );
};

export default Login;
