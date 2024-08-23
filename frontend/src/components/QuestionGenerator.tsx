import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Sidebar from "./ui/Sidebar";
import axiosInstance from "../axiosConfig";

const QuestionGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!jobDescription) {
      setError("Job description is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/generate-questions", {
        jobDescription,
      });
      setGeneratedQuestions(response.data.questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      setError(
        "An error occurred while generating questions. Please try again."
      );
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
          bgcolor: "#0D0D1A",
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
          Generate Interview Questions
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
          <TextField
            placeholder="Enter job description (company, industry, role, etc.)..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            multiline
            rows={4}
            variant="filled"
            fullWidth
            InputProps={{
              disableUnderline: true,
              style: { color: "#9090AF" },
            }}
            sx={{
              marginBottom: 2,
              "& .MuiFilledInput-root": {
                backgroundColor: "#20202C",
                "&:hover": { backgroundColor: "#20202C" },
                "&.Mui-focused": { backgroundColor: "#20202C" },
              },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#623BFB",
              "&:hover": { backgroundColor: "#4e2fc7" },
            }}
          >
            Generate Questions
          </Button>
        </Box>
        {error && (
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
        {generatedQuestions.length > 0 && (
          <Box sx={{ width: "100%", maxWidth: "600px", marginTop: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Generated Questions:
            </Typography>
            <List>
              {generatedQuestions.map((question, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: "#20202C",
                    marginBottom: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemText primary={question} sx={{ color: "#FFFFFF" }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuestionGenerator;
