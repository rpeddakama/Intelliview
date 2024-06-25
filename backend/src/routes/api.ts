import { Router, Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import FormData from "form-data";

import authenticateToken from "../middleware/auth";
import dotenv from "dotenv";
import Note from "../models/Note";
import Recording from "../models/Recording";
import User from "../models/User";

const upload = multer();
const router = Router();
dotenv.config();

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

router.post(
  "/transcribe",
  authenticateToken,
  upload.single("audio"),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const fileType = req.file.mimetype;
      if (
        !["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"].includes(
          fileType
        )
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

      const analysisPrompt = `Analyze the following transcription of a response to the following behavioral interview question: ${req.body.question}. Assess the quality of the response, including the clarity, relevance, and completeness of the answer:\n\n${transcription.text}`;

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
      const analysis = analysisResponse.data.choices[0].message.content;

      // Create a new recording
      const newRecording = new Recording({
        question: req.body.question,
        transcription: transcription.text,
        analysis: analysis,
        date: new Date(),
      });

      await newRecording.save({ session });

      // Add the recording to user's profile
      const user = (req as any).user;
      user.recordings.push(newRecording._id);
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json({ transcription: transcription.text, analysis: analysis });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error processing audio file:", error);
      res.status(500).send("Error processing audio file");
    }
  }
);

router.get(
  "/recordings",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const userProfile = await User.findById(user._id).populate("recordings");
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(userProfile.recordings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
