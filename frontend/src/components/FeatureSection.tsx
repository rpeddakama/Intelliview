import React, { useState } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const features = [
  { title: "Feature 1", description: "This is the description for Feature 1." },
  { title: "Feature 2", description: "This is the description for Feature 2." },
  { title: "Feature 3", description: "This is the description for Feature 3." },
  { title: "Feature 4", description: "This is the description for Feature 4." },
];

const FeatureBox = styled(Box)`
  padding: 20px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DescriptionBox = styled(Box)`
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
`;

const FeatureSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={2}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <FeatureBox onMouseEnter={() => setSelectedFeature(feature)}>
              <Typography variant="h6">{feature.title}</Typography>
            </FeatureBox>
          </Grid>
        ))}
      </Grid>
      <DescriptionBox>
        <Typography variant="h5">{selectedFeature.title}</Typography>
        <Typography variant="body1">{selectedFeature.description}</Typography>
      </DescriptionBox>
    </Container>
  );
};

export default FeatureSection;
