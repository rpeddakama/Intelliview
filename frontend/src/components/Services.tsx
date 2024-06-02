import React from "react";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ServicesContainer = styled(Container)`
  padding: 50px 20px;
  text-align: center;
`;

const Services: React.FC = () => {
  return (
    <ServicesContainer>
      <Typography variant="h2">Our Services</Typography>
      <Typography variant="body1">
        We offer a wide range of services to meet your needs, including
        consulting, training, and support. Contact us to learn more about how we
        can help you achieve your goals.
      </Typography>
    </ServicesContainer>
  );
};

export default Services;
