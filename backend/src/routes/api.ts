import { Router, Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import FormData from "form-data";
import rateLimit from "express-rate-limit";

import { authenticateToken } from "../middleware/auth";
import dotenv from "dotenv";
import Note from "../models/Note";
import Recording from "../models/Recording";
import User from "../models/User";

const upload = multer();
const router = Router();
dotenv.config();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.use(apiLimiter);
router.use(authenticateToken);

router.get("/message", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  res.send("Hello from the API!");
});

router.post("/chat", async (req: Request, res: Response) => {
  const { question, transcription, analysis, input } = req.body;

  if (!analysis || !transcription) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatConfig = {
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY2}`,
      },
      data: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an interview assistant. Here is what they responded to the 
            question: ${question}: ${transcription} and here is what the ai thought of the 
            response: ${analysis}. You should respond to additional questions to the best of your ability.`,
          },
          { role: "user", content: input },
        ],
        max_tokens: 500,
      }),
    };

    const response = await axios(chatConfig);

    const reply = response.data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    res.status(500).json({ error: "Error communicating with OpenAI API" });
  }
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const analysisPrompt = `Analyze the following transcription of a response to the following behavioral interview question:
    ${req.body.question}. Assess the quality of the response, including the clarity, relevance, and completeness of the answer.
    Make sure to end your response with "Feel free to ask me any clarifying questions!" Here is their answer:\n\n${transcription.text}.`;

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
});

router.get("/recordings", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userProfile = await User.findById(user._id).populate("recordings");
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userProfile.recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
