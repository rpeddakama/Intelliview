import React from "react";
import { Button } from "@mui/material";

interface RecordingButtonProps {
  onClick: () => void;
}

export const StartRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#6200EE",
      "&:hover": {
        backgroundColor: "#3700B3",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Start Recording
  </Button>
);

export const PauseRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#FFA000",
      "&:hover": {
        backgroundColor: "#FF8F00",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Pause
  </Button>
);

export const ResumeRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#FFA000",
      "&:hover": {
        backgroundColor: "#FF8F00",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Resume
  </Button>
);

export const StopRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#D32F2F",
      "&:hover": {
        backgroundColor: "#B71C1C",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Stop
  </Button>
);

export const RestartRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#FFF",
      color: "#000",
      "&:hover": {
        backgroundColor: "#EEE",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Restart
  </Button>
);

export const SubmitRecordingButton: React.FC<RecordingButtonProps> = ({
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    sx={{
      backgroundColor: "#6200EE",
      "&:hover": {
        backgroundColor: "#3700B3",
      },
      padding: "10px 24px",
      fontSize: "16px",
    }}
  >
    Submit Recording
  </Button>
);
