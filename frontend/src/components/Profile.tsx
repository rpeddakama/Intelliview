import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Grid,
  Toolbar,
  Chip,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import EmailIcon from "@mui/icons-material/Email";
import StarIcon from "@mui/icons-material/Star";
import MicIcon from "@mui/icons-material/Mic";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axiosInstance from "../axiosConfig";

interface UserProfile {
  email: string;
  accountTier: string;
  recordingsUsed: number;
  recordingsLimit: number | null;
  chatMessagesUsed: number;
  chatMessagesLimit: number | null;
  isPremium: boolean;
  subscriptionStatus: string;
  subscriptionEndDate: string | null;
  cancelAtPeriodEnd: boolean;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/profile");
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

  const getSubscriptionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "trialing":
        return "info";
      case "canceled":
        return "error";
      case "none":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#0D0D1A" }}>
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
        <Typography variant="h5" gutterBottom fontFamily={"GT-Eesti-Medium"}>
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
                  <EmailIcon sx={{ mr: 2, color: "#9494AA", fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" color="#9494AA">
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
                  <StarIcon sx={{ mr: 2, color: "#9494AA", fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" color="#9494AA">
                      Account Tier
                    </Typography>
                    <Typography variant="h5" color="white">
                      {profile.accountTier}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box mt={4} mb={6}>
              <Typography variant="h6" color="#9494AA" gutterBottom>
                Subscription Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" color="white" mr={2}>
                      Status:
                    </Typography>
                    <Chip
                      label={profile.subscriptionStatus || "None"}
                      color={getSubscriptionStatusColor(
                        profile.subscriptionStatus
                      )}
                      size="small"
                      sx={{
                        color: "white",
                        bgcolor: (theme) =>
                          profile.subscriptionStatus.toLowerCase() === "none"
                            ? theme.palette.grey[700]
                            : undefined,
                      }}
                    />
                  </Box>
                </Grid>
                {profile.subscriptionEndDate && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon sx={{ mr: 2, color: "#C3C3C3" }} />
                      <Typography variant="body1" color="white">
                        {profile.cancelAtPeriodEnd
                          ? `Subscription ends on ${new Date(
                              profile.subscriptionEndDate
                            ).toLocaleDateString()}`
                          : `Next billing date: ${new Date(
                              profile.subscriptionEndDate
                            ).toLocaleDateString()}`}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box mt={6}>
              <Box mb={5}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center">
                    <MicIcon sx={{ mr: 2, color: "#9494AA", fontSize: 40 }} />
                    <Typography variant="h5" color="#9494AA">
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
                      (profile.recordingsLimit || profile.recordingsUsed + 1)) *
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
                    <ChatIcon sx={{ mr: 2, color: "#9494AA", fontSize: 40 }} />
                    <Typography variant="h5" color="#9494AA">
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
                      (profile.chatMessagesLimit ||
                        profile.chatMessagesUsed + 1)) *
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
