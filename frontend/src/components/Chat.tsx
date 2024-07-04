import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, keyframes } from "@mui/material";
import axiosInstance from "../axiosConfig";

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
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!recordingId) {
        console.error("recordingId is undefined");
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/chat/${recordingId}`);
        console.log("Fetched chat messages:", response.data);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
  }, [recordingId]);

  const handleSend = async () => {
    if (input.trim() === "" || !recordingId) return;

    setIsWaitingForResponse(true);

    console.log("Sending request with data:", {
      recordingId,
      question,
      transcription,
      analysis,
      input,
    });

    try {
      const response = await axiosInstance.post<{
        reply: string;
        messages: Message[];
      }>("/api/chat", {
        recordingId,
        question,
        transcription,
        analysis,
        input,
      });

      console.log("Received response:", response.data);
      setMessages(response.data.messages);
      setInput("");
    } catch (error) {
      console.error("Detailed error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: "Maxview AI",
          text: "Error fetching response. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#1e1e1e",
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
        <Box
          component="span"
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #ff00ff, #00ffff)",
            marginRight: "10px",
          }}
        />
        Maxview AI
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
              Maxview AI:
            </Typography>
            <TypingBubble />
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isWaitingForResponse}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "#2a2a2a",
              "& fieldset": {
                borderColor: "#444",
              },
              "&:hover fieldset": {
                borderColor: "#666",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#888",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isWaitingForResponse}
          sx={{
            marginLeft: "10px",
            backgroundColor: "#2a2a2a",
            color: "white",
            "&:hover": {
              backgroundColor: "#444",
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
