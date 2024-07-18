import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, IconButton, Slider } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

interface AudioPlayerProps {
  audioBuffer: ArrayBuffer;
  audioMime: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBuffer,
  audioMime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      currentTimeRef.current = audioRef.current.currentTime;
      const newProgress = (currentTimeRef.current / durationRef.current) * 100;
      setProgress(newProgress);
    }
  }, []);

  useEffect(() => {
    const blob = new Blob([audioBuffer], { type: audioMime });
    const url = URL.createObjectURL(blob);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.addEventListener("canplay", handleCanPlay);
      audioRef.current.addEventListener("ended", handleEnded);
    }

    // Calculate duration based on audio buffer length
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContext.decodeAudioData(audioBuffer.slice(0), (buffer) => {
      durationRef.current = buffer.duration;
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      URL.revokeObjectURL(url);
    };
  }, [audioBuffer, audioMime]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100); // Ensure the progress bar is at 100% when ended
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (audioRef.current && typeof newValue === "number") {
      const newTime = (newValue / 100) * durationRef.current;
      audioRef.current.currentTime = newTime;
      currentTimeRef.current = newTime;
      setProgress(newValue);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "500px",
        bgcolor: "#20202C",
        p: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 1,
      }}
    >
      <audio ref={audioRef} />
      <IconButton
        onClick={togglePlayPause}
        disabled={isLoading}
        sx={{
          color: "white",
          bgcolor: "#623BFB",
          "&:hover": { bgcolor: "#7C5AFE" },
          "&.Mui-disabled": { bgcolor: "#4A4A5A" },
          width: 40,
          height: 40,
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        <Slider
          value={progress}
          onChange={handleSliderChange}
          disabled={isLoading}
          sx={{
            color: "#623BFB",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px rgb(98 59 251 / 16%)`,
              },
              "&.Mui-active": {
                width: 12,
                height: 12,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="white">
            {formatTime(currentTimeRef.current)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AudioPlayer;
