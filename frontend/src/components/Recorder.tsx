import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";
import {
  StartRecordingButton,
  PauseRecordingButton,
  ResumeRecordingButton,
  StopRecordingButton,
  RestartRecordingButton,
  SubmitRecordingButton,
} from "./ui/RecordingButtons";
import Chat from "./Chat"; // Import the Chat component

const TempForm: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track submission
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDuration = 3 * 60 * 1000; // 3 minutes in milliseconds

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
        setPaused(false);
        setError(null);
        setSubmitted(false); // Reset submission state when recording starts

        const startTime = Date.now();
        intervalRef.current = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const progress = (elapsedTime / maxDuration) * 100;
          if (progress >= 100) {
            clearInterval(intervalRef.current!);
            setRecording(false);
            setPaused(false);
            setProgress(100);
            stopRecording();
          } else {
            setProgress(progress);
          }
        }, 1000);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone.");
      });
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setPaused(false);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
    setIsRecorded(true);
    setProgress(0); // Reset the progress bar
  };

  const restartRecording = () => {
    audioChunksRef.current = [];
    startRecording();
    setIsRecorded(false);
    setSubmitted(false); // Reset submission state
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

    setLoading(true); // Set loading to true when the submission starts
    setSubmitted(true); // Set submission state to true immediately on submit
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
      setSubmitted(false); // Reset submission state on error
    } finally {
      setLoading(false); // Set loading to false when the submission is complete
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
        {recording && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: "100%",
              maxWidth: "600px",
              marginBottom: 2,
            }}
          />
        )}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          {!recording && !paused && !isRecorded && (
            <StartRecordingButton onClick={startRecording} />
          )}
          {recording && !paused && (
            <PauseRecordingButton onClick={pauseRecording} />
          )}
          {paused && <ResumeRecordingButton onClick={resumeRecording} />}
          {(recording || paused) && (
            <StopRecordingButton onClick={stopRecording} />
          )}
        </Box>
        {isRecorded && !recording && !paused && !submitted && (
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <RestartRecordingButton onClick={restartRecording} />
            <SubmitRecordingButton onClick={handleSubmit} />
          </Box>
        )}
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
            <audio src={audioURL} controls style={{ width: "100%" }} />
          </Box>
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
          <Chat transcription={transcription} analysis={analysis} />
        )}
      </Box>
    </Box>
  );
};

export default TempForm;
