import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

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
    <React.Fragment>
      <button onClick={handleProfile}>Profile</button>
      <button onClick={handleLogout}>Logout</button>
      {/* </Toolbar> */}
    </React.Fragment>
    // <MainContainer>
    //   <Grid container spacing={3}>
    //     <Grid item xs={12}>
    //       <PaperStyled>
    //         <Typography variant="h5">
    //           Welcome to the HackerRank Dashboard
    //         </Typography>
    //         <Typography variant="body1">
    //           Practice coding, prepare for interviews, and get hired.
    //         </Typography>
    //       </PaperStyled>
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <PaperStyled>
    //         <CardContainer>
    //           <Typography variant="h6">Practice</Typography>
    //           <Button variant="contained" color="primary">
    //             Start
    //           </Button>
    //         </CardContainer>
    //         <Typography variant="body2">
    //           Improve your coding skills by solving practice problems.
    //         </Typography>
    //       </PaperStyled>
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <PaperStyled>
    //         <CardContainer>
    //           <Typography variant="h6">Contests</Typography>
    //           <Button variant="contained" color="primary">
    //             Participate
    //           </Button>
    //         </CardContainer>
    //         <Typography variant="body2">
    //           Join coding contests and challenge yourself.
    //         </Typography>
    //       </PaperStyled>
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <PaperStyled>
    //         <CardContainer>
    //           <Typography variant="h6">Interview Preparation</Typography>
    //           <Button variant="contained" color="primary">
    //             Prepare
    //           </Button>
    //         </CardContainer>
    //         <Typography variant="body2">
    //           Get ready for your next technical interview.
    //         </Typography>
    //       </PaperStyled>
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <PaperStyled>
    //         <CardContainer>
    //           <Typography variant="h6">Job Offers</Typography>
    //           <Button variant="contained" color="primary">
    //             Explore
    //           </Button>
    //         </CardContainer>
    //         <Typography variant="body2">
    //           Find your next job opportunity.
    //         </Typography>
    //       </PaperStyled>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <PaperStyled>
    //         <Typography variant="h6">Add a New Note</Typography>
    //         <form onSubmit={handleSubmit}>
    //           <TextField
    //             label="Title"
    //             fullWidth
    //             margin="normal"
    //             value={title}
    //             onChange={(e) => setTitle(e.target.value)}
    //             />
    //           <TextField
    //             label="Content"
    //             fullWidth
    //             multiline
    //             rows={4}
    //             margin="normal"
    //             value={content}
    //             onChange={(e) => setContent(e.target.value)}
    //           />
    //           <Button type="submit" variant="contained" color="primary">
    //             Submit
    //           </Button>
    //         </form>
    //       </PaperStyled>
    //     </Grid>
    //   </Grid>
    // </MainContainer>
  );
};

export default Dashboard;
