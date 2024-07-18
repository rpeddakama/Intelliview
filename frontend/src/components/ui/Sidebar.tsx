import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Home, Person, History, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import axiosInstance from "../../axiosConfig";
import Logo from "../ui/Logo";

interface UserProfile {
  email: string;
  accountTier: string;
  recordingsUsed: number;
  recordingsLimit: number;
  chatMessagesUsed: number;
  chatMessagesLimit: number;
  isPremium: boolean;
}

const Sidebar: React.FC = () => {
  const drawerWidth = 240;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/profile");
      setProfile(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Error fetching profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpgradeClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/stripe/create-stripe-customer",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.stripeCustomerId) {
        const stripeUrl = new URL("https://buy.stripe.com/3cs4j6dHx2ZWcJacMM");
        if (profile && profile.email) {
          stripeUrl.searchParams.append("prefilled_email", profile.email);
        }
        window.location.href = stripeUrl.toString();
      } else {
        console.error("Failed to create Stripe customer");
      }
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#191925",
          color: "white",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{ display: "flex", alignItems: "center", pl: 2, py: 1, ml: 1 }}
      >
        <Logo width={120} height={28} />
      </Toolbar>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <List>
            {[
              { text: "Home", icon: <Home />, link: "/dashboard" },
              {
                text: "Past Sessions",
                icon: <History />,
                link: "/past-sessions",
              },
              { text: "Profile", icon: <Person />, link: "/profile" },
            ].map((item) => (
              <ListItem
                button
                component={Link}
                to={item.link}
                key={item.text}
                sx={{
                  "&:hover": {
                    backgroundColor: "#252530",
                    borderRadius: "10px",
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                  margin: "5px 10px",
                  padding: "10px 20px",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: "inherit" }} />
              </ListItem>
            ))}
          </List>
          {!isLoading && profile && !profile.isPremium && (
            <Box sx={{ mx: "10px", px: "20px" }}>
              <Button
                variant="contained"
                onClick={handleUpgradeClick}
                startIcon={<Add />}
                sx={{
                  backgroundColor: "#623BFB",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#623BFB",
                  },
                  textTransform: "none",
                }}
              >
                Upgrade to Pro
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 2, mx: "10px", px: "20px" }}>
          <Logout />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
