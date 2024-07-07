import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Snackbar } from "@mui/material";
import axiosInstance from "../axiosConfig";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
      });

      setSuccessMessage(
        "Registration successful! Please check your email to verify your account."
      );
      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error registering:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

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
        component="form"
        onSubmit={handleSubmit}
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
              backgroundColor: "#3A3A3A",
              "&:hover": {
                backgroundColor: "#444444",
              },
              "&.Mui-focused": {
                backgroundColor: "#3A3A3A",
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
            marginBottom: "16px",
            "& .MuiFilledInput-root": {
              backgroundColor: "#3A3A3A",
              "&:hover": {
                backgroundColor: "#444444",
              },
              "&.Mui-focused": {
                backgroundColor: "#3A3A3A",
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{
            marginBottom: "24px",
            "& .MuiFilledInput-root": {
              backgroundColor: "#3A3A3A",
              "&:hover": {
                backgroundColor: "#444444",
              },
              "&.Mui-focused": {
                backgroundColor: "#3A3A3A",
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
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#623BFB",
            },
            marginBottom: "16px",
            padding: "10px 0",
          }}
        >
          Register
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#888888", marginBottom: "16px" }}
        >
          Already have an account?{" "}
          <Button
            color="primary"
            onClick={() => navigate("/login")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              padding: 0,
              minWidth: "auto",
            }}
          >
            Log in
          </Button>
        </Typography>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Box>
  );
};

export default Register;
