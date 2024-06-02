import React from "react";
import { FooterContainer, FooterText } from "../styles";

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText variant="body2">
        &copy; 2024 MyApp. All rights reserved.
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
