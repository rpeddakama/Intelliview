import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import axiosInstance from "../axiosConfig";

interface ChatProps {
  transcription: string;
  analysis: string;
}

const Chat: React.FC<ChatProps> = ({ transcription, analysis }) => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState<string>("");
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { user: "You", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsWaitingForResponse(true);

    try {
      const response = await axiosInstance.post("/api/chat", {
        transcription: transcription,
        analysis: analysis,
        input: input,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Bot", text: "Error fetching response" },
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
        backgroundColor: "#333",
        padding: "20px",
        borderRadius: "8px",
        marginTop: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "white", marginBottom: 2 }}>
        Chat
      </Typography>
      {messages.length > 0 && (
        <Paper
          elevation={3}
          style={{
            maxHeight: "300px",
            overflow: "auto",
            backgroundColor: "#444",
          }}
        >
          <List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${message.user}: ${message.text}`}
                  sx={{ color: "white" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Box display="flex" mt={2}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          InputProps={{
            style: {
              color: "white",
              backgroundColor: "#555",
            },
            disabled: isWaitingForResponse,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          style={{ marginLeft: "1rem" }}
          disabled={isWaitingForResponse}
        >
          Ask
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
