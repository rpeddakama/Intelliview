import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography, LinearProgress } from "@mui/material";
import { PlayArrow, Pause, Stop, Replay } from "@mui/icons-material";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRestart: () => void;
}

const MAX_DURATION = 180; // 3 minutes in seconds

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRestart,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
        setAudioBlob(null);

        intervalRef.current = setInterval(() => {
          setDuration((prev) => {
            if (prev >= MAX_DURATION) {
              stopRecording();
              return MAX_DURATION;
            }
            return prev + 1;
          });
        }, 1000);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      clearInterval(intervalRef.current!);
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        onRecordingComplete(blob);
      };
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const restartRecording = () => {
    onRestart();
    audioChunksRef.current = [];
    setDuration(0);
    setAudioBlob(null);
    startRecording();
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (duration / MAX_DURATION) * 100;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        bgcolor: "#1E1E1E",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="white" align="center" gutterBottom>
        {formatTime(duration)}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 40,
          backgroundColor: "#2c2c2c",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#4c4c4c",
          },
          mb: 2,
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        {!isRecording && !audioBlob ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={startRecording}
            fullWidth
          >
            Record
          </Button>
        ) : isRecording ? (
          <>
            <Button
              variant="contained"
              color={isPaused ? "primary" : "secondary"}
              startIcon={isPaused ? <PlayArrow /> : <Pause />}
              onClick={isPaused ? resumeRecording : pauseRecording}
              sx={{ flex: 1, mr: 1 }}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={stopRecording}
              sx={{ flex: 1, mx: 1 }}
            >
              Stop
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<Replay />}
              onClick={restartRecording}
              sx={{ flex: 1, ml: 1 }}
            >
              Restart
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              onClick={isPlaying ? pausePlayback : playRecording}
              sx={{ flex: 1, mr: 1 }}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<Replay />}
              onClick={restartRecording}
              sx={{ flex: 1, ml: 1 }}
            >
              Restart
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AudioRecorder;
