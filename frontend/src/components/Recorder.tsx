import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";
import AudioRecorder from "./ui/Audio";
import Chat from "./Chat";
import axios from "axios";

interface RecordingData {
  id: string;
  question: string;
  transcription: string;
  analysis: string;
}

interface LocationState {
  isCustomQuestion: boolean;
  selectedIndustry?: string;
  questions?: string[];
}

const Recorder: React.FC = () => {
  const location = useLocation();
  const { isCustomQuestion, selectedIndustry, questions } =
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
    if (!isCustomQuestion && questions && questions.length > 0) {
      setQuestion(questions[0]);
    }
  }, [isCustomQuestion, questions]);

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
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        !response.data ||
        !response.data._id ||
        !response.data.transcription ||
        !response.data.analysis
      ) {
        throw new Error("Invalid response data from server");
      }

      setRecordingData({
        id: response.data._id,
        question: question,
        transcription: response.data.transcription,
        analysis: response.data.analysis,
      });
      setError(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      if (axios.isAxiosError(error)) {
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
          {isCustomQuestion ? (
            <TextField
              placeholder="Enter interview question..."
              value={question}
              onChange={(e) =>
                e.target.value.length <= 300
                  ? setQuestion(e.target.value)
                  : null
              }
              multiline
              rows={4}
              variant="filled"
              fullWidth
              disabled={isSubmitted}
              inputProps={{ maxLength: 300 }}
              InputProps={{
                disableUnderline: true,
                style: { color: "white" },
              }}
              sx={{
                marginBottom: 2,
                "& .MuiFilledInput-root": {
                  backgroundColor: "#333",
                  "&:hover": { backgroundColor: "#444" },
                  "&.Mui-focused": { backgroundColor: "#333" },
                  "&.Mui-disabled": { backgroundColor: "#2A2A2A" },
                },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#CCCCCC",
                  opacity: 0.7,
                },
              }}
            />
          ) : (
            <FormControl
              fullWidth
              variant="filled"
              sx={{
                marginBottom: 2,
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#623BFB",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#623BFB",
                },
                "& .MuiInputLabel-root.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              <InputLabel id="question-select-label" sx={{ color: "white" }}>
                Select a question
              </InputLabel>
              <Select
                labelId="question-select-label"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isSubmitted}
                sx={{
                  color: "white",
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#333",
                    "&:hover": { backgroundColor: "#444" },
                    "&.Mui-focused": { backgroundColor: "#333" },
                  },
                  "& .MuiSelect-icon": { color: "white" },
                  "&.Mui-focused .MuiSelect-icon": { color: "#623BFB" },
                  "&.Mui-disabled": {
                    color: "white",
                    opacity: 0.7,
                    "-webkit-text-fill-color": "white",
                  },
                  "& .MuiSelect-select.Mui-disabled": {
                    color: "white",
                    opacity: 0.7,
                    "-webkit-text-fill-color": "white",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: "auto",
                      maxWidth: "600px",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                {questions?.map((q, index) => (
                  <MenuItem
                    key={index}
                    value={q}
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {q}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
