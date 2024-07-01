import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { Box, CssBaseline, Toolbar, Typography, Divider } from "@mui/material";
import Sidebar from "./ui/Sidebar";

interface Recording {
  _id: string;
  question: string;
  transcription: string;
  analysis: string;
  date: string;
}

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await axiosInstance.get(`/api/recordings/${id}`);
        setRecording(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching recording:", error);
        setError("Error fetching recording.");
      }
    };

    fetchRecording();
  }, [id]);

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
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          recording && (
            <>
              <Typography variant="h5" gutterBottom>
                Session Details
              </Typography>
              <Typography variant="h6">{recording.question}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Transcription:</strong>
                <br />
                {recording.transcription}
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "#444" }} />
              <Typography variant="body1">
                <strong>Analysis:</strong>
                <br />
                {recording.analysis}
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "#444" }} />
              <Typography variant="body1" color="gray">
                <strong>Date:</strong>{" "}
                {new Date(recording.date).toLocaleString()}
              </Typography>
            </>
          )
        )}
      </Box>
    </Box>
  );
};

export default SessionDetail;
