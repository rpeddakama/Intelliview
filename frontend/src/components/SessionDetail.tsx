import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";

interface Recording {
  _id: string;
  question: string;
  transcription: string;
  analysis: string;
  date: string;
  audioUrl: string;
}

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Recording | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axiosInstance.get(`/api/recordings/${id}`);
        setSession(response.data);
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    fetchSession();
  }, [id]);

  if (!session) {
    return <div>Loading...</div>;
  }

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
          {session.question}
        </Typography>
        <Card sx={{ bgcolor: "#333", color: "white", mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Question</Typography>
            <Typography>{session.question}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#333", color: "white", mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Transcription</Typography>
            <Typography>{session.transcription}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#333", color: "white", mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Audio</Typography>
            <audio controls>
              <source src={session.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#333", color: "white", mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Analysis</Typography>
            <Typography>{session.analysis}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SessionDetail;
