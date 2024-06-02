import React from "react";
import { MainContainer, Title, Description, StyledButton } from "../styles";
import FeatureSection from "./FeatureSection";

const MainSection: React.FC = () => {
  return (
    <MainContainer>
      <Title variant="h2">Welcome to MyApp</Title>
      <Description variant="body1">
        We provide the best services to help you achieve your goals. Join us to
        make the most out of your life.
      </Description>
      <StyledButton variant="contained" href="#contact">
        Get Started
      </StyledButton>
      <FeatureSection />
    </MainContainer>
  );
};

export default MainSection;
