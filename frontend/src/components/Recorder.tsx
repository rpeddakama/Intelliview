import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";
import AudioRecorder from "./ui/Audio";
import Chat from "./Chat";

const TempForm: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleRestart = () => {
    setAudioBlob(null);
    setTranscription(null);
    setAnalysis(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!question) {
      setError("Question is required.");
      return;
    }
    if (!audioBlob) {
      setError("No audio recorded.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", question);

    try {
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTranscription(response.data.transcription);
      setAnalysis(response.data.analysis);
      setError(null);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setError("Error uploading audio.");
    } finally {
      setLoading(false);
    }
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "64px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "#AAA",
          }}
        >
          Practice with a custom interview question
        </Typography>
        <TextField
          placeholder="Enter interview question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          rows={4}
          variant="filled"
          fullWidth
          InputProps={{
            disableUnderline: true,
            style: {
              color: "white",
              backgroundColor: "#333",
            },
          }}
          sx={{
            width: "100%",
            maxWidth: "600px",
            marginBottom: 2,
            "& .MuiFilledInput-root": {
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#444",
              },
              "&.Mui-focused": {
                backgroundColor: "#333",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          }}
        />
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onRestart={handleRestart}
        />
        {audioBlob && (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Recording
            </Button>
          </Box>
        )}
        {error && (
          <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
        )}
        {loading && <CircularProgress sx={{ marginTop: 2 }} />}
        {transcription && (
          <Box
            sx={{
              marginTop: 2,
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#333",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>Transcription:</strong> {transcription}
            </Typography>
          </Box>
        )}
        {analysis && (
          <Box
            sx={{
              marginTop: 2,
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#333",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body1" sx={{ color: "white" }}>
              <strong>Analysis:</strong> {analysis}
            </Typography>
          </Box>
        )}
        {transcription && analysis && (
          <Chat
            question={question}
            transcription={transcription}
            analysis={analysis}
          />
        )}
      </Box>
    </Box>
  );
};

export default TempForm;
