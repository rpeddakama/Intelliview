import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";
import AudioRecorder from "./ui/Audio";
import Chat from "./Chat";
import axios from "axios";

// Import the industry questions
import industryQuestions from "../data/industryQuestions.json";

// Define the type for our industryQuestions
type IndustryQuestions = {
  [key: string]: {
    icon: string;
    questions: string[];
  };
};

// Assert the type of industryQuestions
const typedIndustryQuestions = industryQuestions as IndustryQuestions;

interface RecordingData {
  id: string;
  question: string;
  transcription: string;
  analysis: string;
}

interface LocationState {
  isCustomQuestion: boolean;
  selectedIndustry?: string;
}

const Recorder: React.FC = () => {
  const location = useLocation();
  const { isCustomQuestion, selectedIndustry } =
    location.state as LocationState;

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(
    null
  );
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [canRecord, setCanRecord] = useState<boolean>(true);

  useEffect(() => {
    checkAudioLimit();
    if (!isCustomQuestion && selectedIndustry) {
      const industrySpecificQuestions =
        typedIndustryQuestions[selectedIndustry].questions;
      const randomQuestion =
        industrySpecificQuestions[
          Math.floor(Math.random() * industrySpecificQuestions.length)
        ];
      setQuestion(randomQuestion);
    }
  }, [isCustomQuestion, selectedIndustry]);

  const checkAudioLimit = async () => {
    try {
      const response = await axiosInstance.get("/api/check-audio-limit");
      setCanRecord(response.data.canSubmit);
      if (!response.data.canSubmit) {
        setError(
          "You've reached the limit for audio submissions. Please upgrade to continue."
        );
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error checking audio limit:", error);
      setCanRecord(false);
      setError("An error occurred while checking the audio submission limit.");
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleRestart = () => {
    setAudioBlob(null);
    setRecordingData(null);
    setError(null);
    setIsSubmitted(false);
    checkAudioLimit();
    if (!isCustomQuestion && selectedIndustry) {
      const industrySpecificQuestions =
        typedIndustryQuestions[selectedIndustry].questions;
      const randomQuestion =
        industrySpecificQuestions[
          Math.floor(Math.random() * industrySpecificQuestions.length)
        ];
      setQuestion(randomQuestion);
    }
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
    formData.append("industry", selectedIndustry || "general");

    try {
      console.log("Sending request to /api/transcribe");
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Received response from /api/transcribe:", response);
      console.log("Response data:", response.data);

      if (
        !response.data ||
        !response.data._id ||
        !response.data.transcription ||
        !response.data.analysis
      ) {
        console.error("Invalid response data:", response.data);
        throw new Error("Invalid response data from server");
      }

      console.log("Setting recording data");
      setRecordingData({
        id: response.data._id,
        question: question,
        transcription: response.data.transcription,
        analysis: response.data.analysis,
      });
      setError(null);
      console.log("Recording data set successfully");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        setError(
          `Error: ${error.response?.data?.error || "An unknown error occurred"}`
        );
      } else if (error instanceof Error) {
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
          {isCustomQuestion
            ? "Practice with a custom interview question"
            : `Practice ${selectedIndustry} interview question`}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
          <TextField
            placeholder={
              isCustomQuestion
                ? "Enter interview question..."
                : "Industry-specific question"
            }
            value={question}
            onChange={(e) =>
              isCustomQuestion && e.target.value.length <= 300
                ? setQuestion(e.target.value)
                : null
            }
            multiline
            rows={4}
            variant="filled"
            fullWidth
            disabled={isSubmitted || !isCustomQuestion}
            inputProps={{ maxLength: 300 }}
            InputProps={{
              disableUnderline: true,
              style: {
                color: "white",
              },
            }}
            sx={{
              marginBottom: 2,
              "& .MuiFilledInput-root": {
                backgroundColor: "#333",
                "&:hover": {
                  backgroundColor: "#444",
                },
                "&.Mui-focused": {
                  backgroundColor: "#333",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#2A2A2A",
                },
              },
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#CCCCCC",
                opacity: 0.7,
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
            canRecord={canRecord}
            onStartRecording={checkAudioLimit}
          />
        </Box>
        {error && !canRecord && (
          <Alert
            severity="warning"
            sx={{
              marginTop: 2,
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            You've reached the limit for audio submissions. Please upgrade to
            continue.
          </Alert>
        )}
        {error && canRecord && (
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
