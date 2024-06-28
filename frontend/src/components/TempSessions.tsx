import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./ui/Sidebar";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axiosInstance.get("/api/recordings");
        setRecordings(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        setError("Error fetching recordings.");
      }
    };

    fetchRecordings();
  }, []);

  const handleSessionClick = (id: string) => {
    navigate(`/session/${id}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#1E1E1E",
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
          {recordings.map((recording, index) => (
            <React.Fragment key={recording._id}>
              <ListItem
                button
                sx={{ bgcolor: "#333", mb: 1 }}
                onClick={() => handleSessionClick(recording._id)}
              >
                <ListItemText
                  primary={recording.question}
                  secondary={new Date(recording.date).toLocaleString()}
                  primaryTypographyProps={{ color: "white" }}
                  secondaryTypographyProps={{ color: "gray" }}
                />
              </ListItem>
              {index < recordings.length - 1 && (
                <Divider sx={{ bgcolor: "#444" }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PastSessions;
