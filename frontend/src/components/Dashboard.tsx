// Dashboard.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const Root = styled("div")({
  flexGrow: 1,
});

const AppBarStyled = styled(AppBar)({
  backgroundColor: "#2C3E50",
});

const Title = styled(Typography)({
  flexGrow: 1,
});

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CardContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16, // Use fixed spacing value
});

const Dashboard: React.FC = () => {
  return (
    <Root>
      <AppBarStyled position="static">
        <Toolbar>
          <Title variant="h6">MyApp</Title>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBarStyled>
      <MainContainer>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PaperStyled>
              <Typography variant="h5">
                Welcome to the HackerRank Dashboard
              </Typography>
              <Typography variant="body1">
                Practice coding, prepare for interviews, and get hired.
              </Typography>
            </PaperStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <PaperStyled>
              <CardContainer>
                <Typography variant="h6">Practice</Typography>
                <Button variant="contained" color="primary">
                  Start
                </Button>
              </CardContainer>
              <Typography variant="body2">
                Improve your coding skills by solving practice problems.
              </Typography>
            </PaperStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <PaperStyled>
              <CardContainer>
                <Typography variant="h6">Contests</Typography>
                <Button variant="contained" color="primary">
                  Participate
                </Button>
              </CardContainer>
              <Typography variant="body2">
                Join coding contests and challenge yourself.
              </Typography>
            </PaperStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <PaperStyled>
              <CardContainer>
                <Typography variant="h6">Interview Preparation</Typography>
                <Button variant="contained" color="primary">
                  Prepare
                </Button>
              </CardContainer>
              <Typography variant="body2">
                Get ready for your next technical interview.
              </Typography>
            </PaperStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <PaperStyled>
              <CardContainer>
                <Typography variant="h6">Job Offers</Typography>
                <Button variant="contained" color="primary">
                  Explore
                </Button>
              </CardContainer>
              <Typography variant="body2">
                Find your next job opportunity.
              </Typography>
            </PaperStyled>
          </Grid>
        </Grid>
      </MainContainer>
    </Root>
  );
};

export default Dashboard;
