import React from "react";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ContactContainer = styled(Container)`
  padding: 50px 20px;
  text-align: center;
`;

const Contact: React.FC = () => {
  return (
    <ContactContainer>
      <Typography variant="h2">Contact Us</Typography>
      <Typography variant="body1">
        We would love to hear from you! Please reach out with any questions,
        comments, or inquiries.
      </Typography>
    </ContactContainer>
  );
};

export default Contact;
