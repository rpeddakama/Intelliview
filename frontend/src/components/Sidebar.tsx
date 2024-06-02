import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Toolbar,
  Box,
  Divider,
} from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import SettingsIcon from "@mui/icons-material/Settings";
// import UpgradeIcon from "@mui/icons-material/Upgrade";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

const SidebarContainer = styled(Box)`
  width: ${drawerWidth}px;
  flex-shrink: 0;
`;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background-color: #1f1f1f; // Sidebar background color
    color: #ffffff; // Sidebar text color
  }
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <StyledDrawer variant="permanent" anchor="left">
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                {/* <DashboardIcon style={{ color: "#FFFFFF" }} /> */}
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                {/* <SettingsIcon style={{ color: "#FFFFFF" }} /> */}
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                {/* <UpgradeIcon style={{ color: "#FFFFFF" }} /> */}
              </ListItemIcon>
              <ListItemText primary="Upgrade to Premium" />
            </ListItem>
          </List>
        </Box>
      </StyledDrawer>
    </SidebarContainer>
  );
};

export default Sidebar;
