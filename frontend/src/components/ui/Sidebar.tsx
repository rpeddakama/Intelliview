import React from "react";
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
  Typography,
} from "@mui/material";
import { Home, Person, History, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Sidebar: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#2E2E2E",
          color: "white",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", pl: 2 }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "white", ml: 1 }}
        >
          Intelliview
        </Typography>
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
                    backgroundColor: "#444",
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
          <Box sx={{ mx: "10px", px: "20px" }}>
            <Button
              variant="contained"
              component="a"
              href="https://buy.stripe.com/3cs4j6dHx2ZWcJacMM"
              target="_blank"
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
        </Box>
        <Box sx={{ mb: 2, mx: "10px", px: "20px" }}>
          <Logout />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
