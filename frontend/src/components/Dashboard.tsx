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
import {
  Add,
  BusinessCenter,
  Code,
  AttachMoney,
  Campaign,
} from "@mui/icons-material";
import Sidebar from "./ui/Sidebar";
import { useNavigate } from "react-router-dom";

// Import the industry questions
import industryQuestions from "../data/industryQuestions.json";

// Icon mapping
const iconMap: { [key: string]: React.ElementType } = {
  BusinessCenter,
  Code,
  AttachMoney,
  Campaign,
};

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

  const cardStyle = {
    backgroundColor: "#333",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    },
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" gutterBottom>
            Home
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            Improve your interview skills with industry-specific questions and
            feedback. Or try your own!
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardStyle} onClick={() => handleCardClick(null)}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Add sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6">Custom</Typography>
                </CardContent>
              </Card>
            </Grid>
            {Object.entries(industryQuestions).map(
              ([industry, data], index) => {
                const IconComponent = iconMap[data.icon] || Add;
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={cardStyle}
                      onClick={() => handleCardClick(industry)}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <IconComponent sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h6">
                          {industry.charAt(0).toUpperCase() +
                            industry.slice(1).replace("_", " ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              }
            )}
          </Grid>
        </Box>
        <Box
          component="footer"
          sx={{
            mt: "auto",
            py: 0,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "gray" }}>
            Email rishi@intelliview.io for problems/suggestions
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
