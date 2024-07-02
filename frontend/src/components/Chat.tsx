import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../axiosConfig";

interface ChatProps {
  question: string;
  transcription: string;
  analysis: string;
}

interface Message {
  user: string;
  text: string;
}

const Chat: React.FC<ChatProps> = ({ question, transcription, analysis }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  useEffect(() => {
    // Add the initial analysis message when the component mounts
    setMessages([{ user: "Maxview AI", text: analysis }]);
  }, [analysis]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [...messages, { user: "You", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsWaitingForResponse(true);

    try {
      const response = await axiosInstance.post<{ reply: string }>(
        "/api/chat",
        {
          question,
          transcription,
          analysis,
          input,
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Maxview AI", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Maxview AI", text: "Error fetching response" },
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
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyPress={(e: React.KeyboardEvent) =>
            e.key === "Enter" && handleSend()
          }
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
