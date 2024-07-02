import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { PlayArrow, Pause, Stop, Replay } from "@mui/icons-material";
import MicIcon from "@mui/icons-material/Mic";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRestart: () => void;
  onSubmit: () => void;
}

const MAX_DURATION = 120;

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRestart,
  onSubmit,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorderRef.current.start(10);
        setIsRecording(true);
        setIsPaused(false);
        setRecordingDuration(0);
        setAudioBlob(null);
        setPlaybackProgress(0);

        startTimer();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev >= MAX_DURATION) {
          stopRecording();
          return MAX_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
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
      startTimer();
    }
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRecordingDuration((prevDuration) => {
      const finalDuration = Math.min(prevDuration, MAX_DURATION);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioBlob(blob);
          onRecordingComplete(blob);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
        };
      }
      setIsRecording(false);
      setIsPaused(false);
      return finalDuration;
    });
  };

  const restartRecording = () => {
    onRestart();
    audioChunksRef.current = [];
    setRecordingDuration(0);
    setAudioBlob(null);
    setPlaybackProgress(0);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    startRecording();
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current && recordingDuration > 0) {
          const progress =
            (audioRef.current.currentTime / recordingDuration) * 100;
          setPlaybackProgress(progress);
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
      };
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = isRecording
    ? (recordingDuration / MAX_DURATION) * 100
    : playbackProgress;

  const displayTime = isRecording
    ? formatTime(recordingDuration)
    : `${formatTime(audioRef.current?.currentTime || 0)} / ${formatTime(
        recordingDuration
      )}`;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#1E1E1E",
        p: 2,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Typography variant="h6" color="white" align="center" gutterBottom>
        {displayTime}
      </Typography>
      {audioBlob && !isRecording && (
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#FFFFFF",
            },
          }}
          onClick={isPlaying ? pausePlayback : playRecording}
          disableRipple
        >
          {isPlaying ? (
            <Pause sx={{ color: "black" }} />
          ) : (
            <PlayArrow sx={{ color: "black" }} />
          )}
        </IconButton>
      )}
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
            style={{ backgroundColor: "#623BFB" }}
            startIcon={<MicIcon />}
            onClick={startRecording}
            fullWidth
          >
            Start Recording
          </Button>
        ) : isRecording ? (
          <>
            <Button
              variant="contained"
              style={{ backgroundColor: "#404040" }}
              startIcon={isPaused ? <PlayArrow /> : <Pause />}
              onClick={isPaused ? resumeRecording : pauseRecording}
              sx={{ flex: 1, mr: 1 }}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="contained"
              style={{ color: "#fffff", backgroundColor: "#CD2222" }}
              startIcon={<Stop />}
              onClick={stopRecording}
              sx={{ flex: 1, mx: 1 }}
            >
              Stop
            </Button>
            <Button
              variant="contained"
              style={{ color: "black", backgroundColor: "#FFFFFF" }}
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
              style={{ color: "black", backgroundColor: "#FFFFFF" }}
              startIcon={<Replay />}
              onClick={restartRecording}
              sx={{ flex: 1, mr: 1 }}
            >
              Restart
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#623BFB" }}
              onClick={onSubmit}
              sx={{ flex: 1, ml: 1 }}
            >
              Generate Analysis
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AudioRecorder;
