import { Router } from "express";
import authenticateToken from "../middleware/middleware";
import Note from "../models/Note";

const router = Router();

// Define routes
router.get("/message", (req, res) => {
  res.send("Hello from the API!");
});

router.post("/notes", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { title, content } = req.body;

    const note = new Note({
      userId,
      title,
      content,
    });

    await note.save();
    res.status(201).json({ message: "Note added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

import multer from "multer";
const upload = multer();
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const fileType = req.file.mimetype;
    if (
      !["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"].includes(fileType)
    ) {
      return res.status(400).send("Invalid file type");
    }

    // Transcription Step
    const transcriptionFormData = new FormData();
    transcriptionFormData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    transcriptionFormData.append("model", "whisper-1");

    const transcriptionConfig = {
      method: "post",
      url: "https://api.openai.com/v1/audio/transcriptions",
      headers: {
        ...transcriptionFormData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY2}`,
      },
      data: transcriptionFormData,
    };

    const transcriptionResponse = await axios(transcriptionConfig);
    const transcription = transcriptionResponse.data;

    const analysisPrompt = `
      Analyze the following transcription of a response to the following behavioral
      interview question ${req.body.question}. Assess the quality of the response, including the clarity, relevance,
      and completeness of the answer:\n\n${transcription.text}`;

    const analysisConfig = {
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY2}`,
      },
      data: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: analysisPrompt },
        ],
        max_tokens: 500,
      }),
    };
    const analysisResponse = await axios(analysisConfig);
    console.log(analysisResponse.data.choices[0].message.content);
    const analysis = analysisResponse.data.choices[0].message.content;

    res.json({ transcription: transcription, analysis: analysis });
  } catch (error) {
    console.error("Error processing audio file:", error);
    res.status(500).send("Error processing audio file");
  }
});

export default router;
