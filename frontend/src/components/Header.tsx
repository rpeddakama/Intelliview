import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)`
  background-color: #1f1f1f; // Header background color
  box-shadow: 0 4px 2px -2px gray;
`;

const Logo = styled(Typography)`
  flex-grow: 1;
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff; // Logo text color
`;

const Nav = styled(Box)`
  display: flex;
  gap: 15px;
`;

const Header: React.FC = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo variant="h6">MyApp</Logo>
        <Nav>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/services">
            Services
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
        </Nav>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
