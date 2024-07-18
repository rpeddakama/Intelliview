import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  keyframes,
} from "@mui/material";
import axiosInstance from "../axiosConfig";
import smallLogo from "../assets/images/small_logo.png";

interface ChatProps {
  recordingId: string;
  question: string;
  transcription: string;
  analysis: string;
}

interface Message {
  user: string;
  text: string;
  timestamp: Date;
}

const typingAnimation = keyframes`
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
`;

const TypingBubble = () => (
  <Box sx={{ display: "flex", columnGap: "4px", marginTop: "8px" }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: "8px",
          height: "8px",
          backgroundColor: "white",
          borderRadius: "50%",
          animation: `${typingAnimation} 1s infinite ${i * 0.3}s`,
        }}
      />
    ))}
  </Box>
);

const Chat: React.FC<ChatProps> = ({
  recordingId,
  question,
  transcription,
  analysis,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatMessages();
    checkChatLimit();
  }, [recordingId]);

  const fetchChatMessages = async () => {
    try {
      const response = await axiosInstance.get(`/api/chat/${recordingId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setError("Failed to fetch chat messages. Please try again.");
    }
  };

  const checkChatLimit = async () => {
    try {
      const response = await axiosInstance.get("/api/check-chat-limit");
      console.log("Chat limit response:", response.data);
      setRemainingMessages(response.data.remainingMessages);
    } catch (error) {
      console.error("Error checking chat limit:", error);
      setError("Failed to check chat limit. Please try again.");
    }
  };

  const handleSend = async () => {
    if (input.trim() === "" || !recordingId || remainingMessages === 0) return;

    setIsWaitingForResponse(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/chat", {
        recordingId,
        question,
        transcription,
        analysis,
        input,
      });

      setMessages(response.data.messages);
      setRemainingMessages(response.data.remainingMessages);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const chatLimitReached = remainingMessages === 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#191925",
        padding: "20px",
        borderRadius: "8px",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}
      >
        <img
          src={smallLogo}
          alt="Intelliview Logo"
          style={{
            width: "24px",
            height: "24px",
            marginRight: "10px",
          }}
        />
        Intelliview
      </Typography>
      <Box
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          marginBottom: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
        }}
      >
        {messages.map((message, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {message.user}:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {message.text}
            </Typography>
          </Box>
        ))}
        {isWaitingForResponse && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Intelliview:
            </Typography>
            <TypingBubble />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {chatLimitReached && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          You've reached the chat message limit. Please upgrade to continue.
        </Alert>
      )}

      {remainingMessages !== null && !chatLimitReached && (
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Remaining messages: {remainingMessages}
        </Typography>
      )}

      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isWaitingForResponse || chatLimitReached}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#9090AF",
              backgroundColor: "#242432",
              "& fieldset": {
                borderColor: "#242432",
              },
              "&:hover fieldset": {
                borderColor: "#242432",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#242432",
              },
              "& .MuiInputBase-input": { color: "white" },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isWaitingForResponse || chatLimitReached}
          sx={{
            marginLeft: "10px",
            backgroundColor: input.length === 0 ? "#242432" : "#6732FF",
            color: input.length === 0 ? "#9090AF" : "white",
            "&:hover": {
              backgroundColor: input.length === 0 ? "#242432" : "#6732FF",
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
