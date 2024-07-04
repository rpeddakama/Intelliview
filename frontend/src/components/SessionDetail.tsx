import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "./ui/Sidebar";

interface SessionData {
  question: string;
  transcription: string;
  analysis: string;
  chatMessages: { user: string; text: string; timestamp: string }[];
}

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get(`/api/sessions/${id}`);
        console.log("Received session data:", response.data);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching session data:", err);
        setError("Failed to load session data");
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!sessionData) return <Typography>No data found</Typography>;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#1E1E1E", p: 3, color: "white" }}
      >
        <Typography variant="h4" gutterBottom>
          {sessionData.question}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Transcription
        </Typography>
        <Typography paragraph>{sessionData.transcription}</Typography>

        <Typography variant="h6" gutterBottom>
          Analysis
        </Typography>
        <Typography paragraph>{sessionData.analysis}</Typography>

        <Typography variant="h6" gutterBottom>
          Chat History
        </Typography>
        {sessionData.chatMessages && sessionData.chatMessages.length > 0 ? (
          sessionData.chatMessages.map((message, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{message.user}</Typography>
              <Typography>{message.text}</Typography>
              <Typography variant="caption">
                {new Date(message.timestamp).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No chat messages for this session.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SessionDetail;
