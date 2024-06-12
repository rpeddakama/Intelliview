import React from "react";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "./Header";

const AboutContainer = styled(Container)`
  padding: 50px 20px;
  text-align: center;
`;

const About: React.FC = () => {
  return (
    <>
      <Header />
      <AboutContainer>
        <Typography variant="h2">About Us</Typography>
        <Typography variant="body1">
          We are dedicated to providing the best services to help you achieve
          your goals. Our team is committed to excellence and customer
          satisfaction.
        </Typography>
      </AboutContainer>
    </>
  );
};

export default About;
