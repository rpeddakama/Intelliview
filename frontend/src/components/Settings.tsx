import React from "react";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SettingsContainer = styled(Container)`
  padding: 20px;
  background-color: #121212; // Adjust based on your theme
  color: #ffffff; // Adjust based on your theme
`;

const Settings: React.FC = () => {
  return (
    <SettingsContainer>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1">
        Manage your application settings here.
      </Typography>
    </SettingsContainer>
  );
};

export default Settings;
