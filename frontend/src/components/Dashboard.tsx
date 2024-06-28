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
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import MetaIcon from "@mui/icons-material/Facebook";
import StripeIcon from "@mui/icons-material/AccountBalanceWallet";
import AmazonIcon from "@mui/icons-material/ShoppingCart";
import AppleIcon from "@mui/icons-material/Apple";
import SpotifyIcon from "@mui/icons-material/MusicNote";
import SlackIcon from "@mui/icons-material/Chat";
import Sidebar from "./Sidebar";

const Dashboard: React.FC = () => {
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
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Start from scratch or select a template below to get started!
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "Start from scratch", icon: <Add />, color: "#333" },
            { label: "Microsoft", icon: <MicrosoftIcon />, color: "#333" },
            { label: "Meta", icon: <MetaIcon />, color: "#333" },
            { label: "Stripe", icon: <StripeIcon />, color: "#333" },
            { label: "Amazon", icon: <AmazonIcon />, color: "#333" },
            { label: "Apple", icon: <AppleIcon />, color: "#333" },
            { label: "Spotify", icon: <SpotifyIcon />, color: "#333" },
            { label: "Slack", icon: <SlackIcon />, color: "#333" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ backgroundColor: item.color }}>
                <CardContent>
                  <Typography sx={{ textAlign: "center" }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
                    {item.label}
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
