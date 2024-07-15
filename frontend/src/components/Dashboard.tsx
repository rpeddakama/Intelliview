import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Sidebar from "./ui/Sidebar";
import { useNavigate } from "react-router-dom";

// Import the industry questions
import industryQuestions from "../data/industryQuestions.json";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (industry: string | null) => {
    if (industry === null) {
      // Custom question
      navigate("/recorder", { state: { isCustomQuestion: true } });
    } else {
      // Industry-specific question
      navigate("/recorder", {
        state: { isCustomQuestion: false, selectedIndustry: industry },
      });
    }
  };

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
        <Typography variant="h5" gutterBottom>
          Home
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Start from scratch or select an industry to get started!
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ backgroundColor: "#333", cursor: "pointer" }}
              onClick={() => handleCardClick(null)}
            >
              <CardContent>
                <Typography sx={{ textAlign: "center" }}>
                  <Add />
                </Typography>
                <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
                  Start from scratch
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {Object.keys(industryQuestions).map((industry, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{ backgroundColor: "#333", cursor: "pointer" }}
                onClick={() => handleCardClick(industry)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
