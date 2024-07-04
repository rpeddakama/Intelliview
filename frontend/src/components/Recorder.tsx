import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";
import AudioRecorder from "./ui/Audio";
import Chat from "./Chat";

interface RecordingData {
  id: string;
  question: string;
  transcription: string;
  analysis: string;
}

const Recorder: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(
    null
  );
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleRestart = () => {
    setAudioBlob(null);
    setRecordingData(null);
    setError(null);
    setIsSubmitted(false);
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
    setIsSubmitted(true);
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", question);

    try {
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Transcribe API response:", response.data);

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response from server");
      }

      const { _id, transcription, analysis } = response.data;

      if (!_id || !transcription || !analysis) {
        console.error("Response data:", response.data);
        throw new Error("Invalid data returned from server");
      }

      setRecordingData({
        id: _id,
        question: question,
        transcription: transcription,
        analysis: analysis,
      });
      setError(null);
    } catch (error) {
      console.error("Error uploading audio:", error);
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError("An unknown error occurred");
      }
      setIsSubmitted(false);
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
            color: "#FFFFFF",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          Practice with a custom interview question
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
          <TextField
            placeholder="Enter interview question..."
            value={question}
            onChange={(e) =>
              e.target.value.length <= 300 ? setQuestion(e.target.value) : null
            }
            multiline
            rows={4}
            variant="filled"
            fullWidth
            disabled={isSubmitted}
            inputProps={{ maxLength: 300 }}
            InputProps={{
              disableUnderline: true,
              style: {
                color: "white",
                backgroundColor: isSubmitted ? "#2A2A2A" : "#333",
              },
            }}
            sx={{
              marginBottom: 2,
              "& .MuiFilledInput-root": {
                backgroundColor: isSubmitted ? "#2A2A2A" : "#333",
                "&:hover": {
                  backgroundColor: isSubmitted ? "#2A2A2A" : "#444",
                },
                "&.Mui-focused": {
                  backgroundColor: isSubmitted ? "#2A2A2A" : "#333",
                },
              },
              "& .MuiInputBase-input": {
                color: isSubmitted ? "#A0A0A0" : "white",
              },
              "& .Mui-disabled": {
                WebkitTextFillColor: "#A0A0A0",
              },
            }}
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRestart={handleRestart}
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
          />
        </Box>
        {error && (
          <Typography
            sx={{
              color: "red",
              marginTop: 2,
              width: "100%",
              maxWidth: "600px",
            }}
          >
            {error}
          </Typography>
        )}
        {loading && <CircularProgress sx={{ marginTop: 2 }} />}
        {recordingData && (
          <Box sx={{ width: "100%", maxWidth: "600px", marginTop: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Recording ID: {recordingData.id}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Transcription:
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 2, whiteSpace: "pre-wrap" }}
            >
              {recordingData.transcription}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Analysis:
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 2, whiteSpace: "pre-wrap" }}
            >
              {recordingData.analysis}
            </Typography>
            <Chat
              recordingId={recordingData.id}
              question={recordingData.question}
              transcription={recordingData.transcription}
              analysis={recordingData.analysis}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Recorder;
