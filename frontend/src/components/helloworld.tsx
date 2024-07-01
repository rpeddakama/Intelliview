import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
// import { Google as GoogleIcon } from 'lucide-react';

const SignUpForm = () => {
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

        <TextField
          fullWidth
          variant="filled"
          placeholder="Name"
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
            },
          }}
        />

        <TextField
          fullWidth
          variant="filled"
          placeholder="Email"
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
            },
          }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="password"
          placeholder="Password"
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
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#8B5CF6",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#7C3AED",
            },
            marginBottom: "16px",
          }}
        >
          Sign Up
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#888888", marginBottom: "16px" }}
        >
          or
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          //   startIcon={<GoogleIcon size={20} />}
          sx={{
            borderColor: "#3A3A3A",
            color: "white",
            textTransform: "none",
            "&:hover": {
              borderColor: "#4A4A4A",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpForm;
