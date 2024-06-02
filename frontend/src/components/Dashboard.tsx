import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const DashboardContainer = styled(Container)`
  padding: 20px;
  background-color: #121212;
  color: #ffffff;
`;

const FeatureBox = styled(Box)`
  padding: 20px;
  margin: 10px;
  background-color: #1e1e1e;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #2c2c2c;
  }
`;

const NotesBox = styled(Box)`
  padding: 20px;
  margin: 10px 0;
  background-color: #1e1e1e;
  border-radius: 8px;
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Create new notes
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FeatureBox>
            <Typography variant="h6">Record or Upload Audio</Typography>
            <Typography variant="body2">Upload an audio file</Typography>
          </FeatureBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FeatureBox>
            <Typography variant="h6">YouTube Video</Typography>
            <Typography variant="body2">Paste a YouTube link</Typography>
          </FeatureBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FeatureBox>
            <Typography variant="h6">PDF Upload</Typography>
            <Typography variant="body2">Upload a PDF file</Typography>
          </FeatureBox>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom>
        All Notes
      </Typography>
      <NotesBox>
        <Typography variant="h6">
          Combining and Compositing Functions
        </Typography>
        <Typography variant="body2">Created on Friday, May 31st</Typography>
      </NotesBox>
    </DashboardContainer>
  );
};

export default Dashboard;
