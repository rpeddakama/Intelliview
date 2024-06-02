import React from "react";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { StyledAppBar, Logo, Nav } from "../styles";

const Header: React.FC = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo variant="h6">MyApp</Logo>
        <Nav>
          <Button color="inherit" component={Link} to="/">
            Home
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
