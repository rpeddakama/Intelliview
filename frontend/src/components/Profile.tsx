import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Grid,
  Toolbar,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import EmailIcon from "@mui/icons-material/Email";
import StarIcon from "@mui/icons-material/Star";
import MicIcon from "@mui/icons-material/Mic";
import ChatIcon from "@mui/icons-material/Chat";
import axiosInstance from "../axiosConfig";

interface UserProfile {
  email: string;
  accountTier: string;
  recordingsUsed: number;
  recordingsLimit: number;
  chatMessagesUsed: number;
  chatMessagesLimit: number;
  isPremium: boolean;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      var response = await axiosInstance.get("/api/profile");
      setProfile(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Error fetching profile. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#1E1E1E" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          color: "white",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        {error && (
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        )}
        {profile && (
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={4}>
                  <EmailIcon sx={{ mr: 2, color: "#C3C3C3", fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" color="#C3C3C3">
                      Email
                    </Typography>
                    <Typography variant="h5" color="white">
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={4}>
                  <StarIcon sx={{ mr: 2, color: "#C3C3C3", fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" color="#C3C3C3">
                      Account Tier
                    </Typography>
                    <Typography variant="h5" color="white">
                      {profile.accountTier}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box mt={6}>
              <Box mb={5}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center">
                    <MicIcon sx={{ mr: 2, color: "#C3C3C3", fontSize: 40 }} />
                    <Typography variant="h5" color="#C3C3C3">
                      Recordings
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="white">
                    {profile.recordingsUsed} /{" "}
                    {profile.recordingsLimit === null
                      ? "∞"
                      : profile.recordingsLimit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (profile.recordingsUsed /
                      (profile.recordingsLimit === null
                        ? profile.recordingsUsed + 1
                        : profile.recordingsLimit)) *
                    100
                  }
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    height: 16,
                    borderRadius: 8,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#623BFB",
                      borderRadius: 8,
                    },
                  }}
                />
              </Box>
              <Box mb={8}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center">
                    <ChatIcon sx={{ mr: 2, color: "#C3C3C3", fontSize: 40 }} />
                    <Typography variant="h5" color="#C3C3C3">
                      Chat Messages
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="white">
                    {profile.chatMessagesUsed} /{" "}
                    {profile.chatMessagesLimit === null
                      ? "∞"
                      : profile.chatMessagesLimit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (profile.chatMessagesUsed /
                      (profile.chatMessagesLimit === null
                        ? profile.chatMessagesUsed + 1
                        : profile.chatMessagesLimit)) *
                    100
                  }
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    height: 16,
                    borderRadius: 8,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#623BFB",
                      borderRadius: 8,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="center">
              <Button
                component="a"
                href="https://billing.stripe.com/p/login/8wM3g54756nDg5W4gg"
                target="_blank"
                variant="contained"
                sx={{
                  backgroundColor: "#623BFB",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#623BFB",
                  },
                }}
              >
                Billing Portal
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
