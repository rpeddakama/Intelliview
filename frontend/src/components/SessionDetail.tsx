import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "./ui/Sidebar";
import AudioPlayer from "./ui/AudioPlayer";

interface SessionData {
  question: string;
  transcription: string;
  analysis: string;
  chatMessages: { user: string; text: string; timestamp: string }[];
  audio: ArrayBuffer;
  audioMime: string;
}

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get(`/api/sessions/${id}`, {
          responseType: "arraybuffer",
        });
        const audioArrayBuffer = response.data;
        const jsonData = JSON.parse(response.headers["x-json-data"]);

        setSessionData({
          ...jsonData,
          audio: audioArrayBuffer,
        });
      } catch (err) {
        console.error("Error fetching session data:", err);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

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
          minHeight: "100vh",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : sessionData ? (
          <>
            <Typography variant="h4" gutterBottom>
              {sessionData.question}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Audio Recording
            </Typography>
            <AudioPlayer
              audioBuffer={sessionData.audio}
              audioMime={sessionData.audioMime}
            />

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
          </>
        ) : (
          <Typography>No data found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SessionDetail;
