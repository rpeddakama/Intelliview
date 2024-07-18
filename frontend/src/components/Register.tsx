import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Snackbar } from "@mui/material";
import axiosInstance from "../axiosConfig";
import Logo from "../components/ui/Logo";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return allowedDomains.includes(domain) || domain.endsWith(".edu");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setError("Please use an email from a valid domain.");
      return;
    }

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
            marginBottom: "16px",
            "& .MuiFilledInput-root": {
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{
            marginBottom: "24px",
            "& .MuiFilledInput-root": {
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
