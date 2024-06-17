import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import axiosInstance from "../axiosConfig";

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
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axiosInstance.post(
        "/api/notes",
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Note added successfully");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to add note:", error);
      alert("Failed to add note");
    }
  };

  return (
    <Root>
      <AppBarStyled position="static">
        <Toolbar>
          <Title variant="h6">MyApp</Title>
          <Button color="inherit" onClick={handleProfile}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
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
          <Grid item xs={12}>
            <PaperStyled>
              <Typography variant="h6">Add a New Note</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  label="Content"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
            </PaperStyled>
          </Grid>
        </Grid>
      </MainContainer>
    </Root>
  );
};

export default Dashboard;
