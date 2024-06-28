import React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Home, Settings, History } from "@mui/icons-material";
import Logout from "../Logout";

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
          overflowX: "hidden", // Prevent horizontal scrollbar
          overflowY: "auto", // Allow vertical scrollbar if needed
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", pl: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: "white" }}>
          Maxview AI
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {["Home", "Past Sessions", "Settings"].map((text, index) => (
          <ListItem
            button
            key={text}
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
              {index === 0 ? (
                <Home />
              ) : index === 1 ? (
                <History />
              ) : (
                <Settings />
              )}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ color: "inherit" }} />
          </ListItem>
        ))}
        <Logout />
      </List>
    </Drawer>
  );
};

export default Sidebar;
