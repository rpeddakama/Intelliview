import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";

interface Recording {
  _id: string;
  question: string;
  transcription: string;
  analysis: string;
  date: string;
}

const PastSessions: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRecordings = async () => {
    try {
      const response = await axiosInstance.get("/api/recordings");
      setRecordings(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      setError("Error fetching recordings. Please try again later.");
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleSessionClick = (id: string) => {
    navigate(`/session/${id}`);
  };

  const handleOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    setShowDeleteId(id);
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    try {
      await axiosInstance.delete(`/api/recordings/${id}`);
      console.log(`Deleted session with id: ${id}`);
      // Refresh the recordings list
      fetchRecordings();
    } catch (error) {
      console.error("Error deleting recording:", error);
      setError("Error deleting recording.");
    }
    setShowDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, " - ");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#0D0D1A",
          p: 3,
          color: "white",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Past Sessions
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {recordings.map((recording) => (
            <React.Fragment key={recording._id}>
              <ListItem
                button
                disableRipple
                sx={{
                  bgcolor: "#20202C",
                  mb: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#434358",
                  },
                }}
                onClick={() => handleSessionClick(recording._id)}
              >
                <Grid container alignItems="center">
                  <Grid item xs>
                    <ListItemText
                      primary={recording.question}
                      primaryTypographyProps={{ color: "white" }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="#9090AF" sx={{ mr: 2 }}>
                      {formatDate(recording.date)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {showDeleteId === recording._id ? (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => handleDelete(e, recording._id)}
                        sx={{
                          color: "red",
                          "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 0.08)",
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        edge="end"
                        aria-label="options"
                        onClick={(e) => handleOptionsClick(e, recording._id)}
                        sx={{
                          color: "#C3C3C3",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PastSessions;
