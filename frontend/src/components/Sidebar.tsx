import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import SettingsIcon from "@mui/icons-material/Settings";
// import UpgradeIcon from "@mui/icons-material/SettingsIcon";
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
    background-color: #1e1e1e; // Adjust based on your theme
    color: #ffffff; // Adjust based on your theme
  }
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <StyledDrawer variant="permanent" anchor="left">
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                {/* <DashboardIcon style={{ color: "#ffffff" }} /> */}
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                {/* <SettingsIcon style={{ color: "#ffffff" }} /> */}
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                {/* <UpgradeIcon style={{ color: "#ffffff" }} /> */}
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
