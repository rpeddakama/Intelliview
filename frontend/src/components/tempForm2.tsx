// TempForm.tsx
import React, { useState, useRef } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axiosInstance from "../axiosConfig";
import Sidebar from "./Sidebar";

const TempForm: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
        setError(null);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone.");
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    if (!question) {
      setError("Question is required.");
      return;
    }
    if (audioChunksRef.current.length === 0) {
      setError("No audio recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    audioChunksRef.current = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioURL(audioUrl);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", question);

    try {
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      setTranscription(response.data.transcription);
      setAnalysis(response.data.analysis);
      setError(null);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setError("Error uploading audio.");
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
          paddingTop: "64px", // To align with the sidebar
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
          Prep for Google interview
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            color: "#AAA",
          }}
        >
          Give an example of when you've worked in a team.
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
        <Button
          onClick={recording ? stopRecording : startRecording}
          variant="contained"
          sx={{
            backgroundColor: recording ? "#D32F2F" : "#6200EE",
            "&:hover": {
              backgroundColor: recording ? "#B71C1C" : "#3700B3",
            },
            padding: "10px 24px",
            fontSize: "16px",
            marginBottom: 2,
          }}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#6200EE",
            "&:hover": {
              backgroundColor: "#3700B3",
            },
            padding: "10px 24px",
            fontSize: "16px",
          }}
          disabled={recording}
        >
          Submit
        </Button>
        {error && (
          <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
        )}
        {audioURL && (
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "#333",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <IconButton aria-label="play/pause">
              <PlayArrowIcon sx={{ height: 38, width: 38, color: "white" }} />
            </IconButton>
            <audio src={audioURL} controls style={{ width: "100%" }} />
          </Box>
        )}
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
      </Box>
    </Box>
  );
};

export default TempForm;
