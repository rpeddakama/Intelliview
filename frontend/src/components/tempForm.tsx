import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Sidebar from "./Sidebar";

const TempForm: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#1E1E1E",
          p: 3,
          color: "white",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Prep for Google interview
          </Typography>
          <Typography variant="h6" gutterBottom>
            Give an example of when you've worked in a team.
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#333",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <TextField
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#333",
                  },
                  "&:hover fieldset": {
                    borderColor: "#333",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#333",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#6200EE",
              "&:hover": {
                backgroundColor: "#3700B3",
              },
            }}
          >
            Start recording
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TempForm;
