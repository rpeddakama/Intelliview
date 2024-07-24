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
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
        const stripeUrl = new URL("https://buy.stripe.com/9AQcPC0UL440aB25km");
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

  const menuItems = [
    { text: "Home", icon: <Home />, link: "/dashboard" },
    { text: "Past Sessions", icon: <History />, link: "/past-sessions" },
    { text: "Profile", icon: <Person />, link: "/profile" },
  ];

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
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.link;
              return (
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
                    margin: "5px 0",
                    padding: "10px 16px",
                    backgroundColor: isSelected ? "#252530" : "transparent",
                    borderRadius: "10px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? "white" : "inherit",
                      minWidth: "40px",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: isSelected ? "white" : "inherit",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
          {!isLoading && profile && !profile.isPremium && (
            <Box sx={{ mx: 2, mt: 2 }}>
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
                  width: "100%",
                }}
              >
                Upgrade to Pro
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 2, mx: 2 }}>
          <Logout />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
