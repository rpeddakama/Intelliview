import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

// Define the color palette
const primaryColor = "#2EC866";
const secondaryColor = "#1F1F1F";
const backgroundColor = "#F7F7F7";
const textColor = "#FFFFFF";
const textSecondaryColor = "#000000";

export const StyledAppBar = styled(AppBar)`
  background-color: ${secondaryColor};
  box-shadow: 0 4px 2px -2px gray;
`;

export const Logo = styled(Typography)`
  flex-grow: 1;
  font-size: 1.5em;
  font-weight: bold;
  color: ${textColor};
`;

export const Nav = styled("nav")`
  display: flex;
  gap: 15px;
`;

export const MainContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  text-align: center;
`;

export const Title = styled(Typography)`
  margin-bottom: 20px;
  font-size: 2.5em;
  color: ${secondaryColor};
`;

export const Description = styled(Typography)`
  margin-bottom: 40px;
  font-size: 1.2em;
  max-width: 600px;
  color: ${secondaryColor};
`;

export const StyledButton = styled(Button)`
  background-color: ${primaryColor};
  color: ${textColor};
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1em;
  &:hover {
    background-color: ${secondaryColor};
    color: ${textColor};
  }
`;

export const FooterContainer = styled(Container)`
  background-color: ${secondaryColor};
  padding: 20px;
  text-align: center;
  margin-top: auto;
`;

export const FooterText = styled(Typography)`
  color: ${textColor};
  font-size: 0.9em;
`;
