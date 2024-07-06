import { Router, Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import FormData from "form-data";
import rateLimit from "express-rate-limit";

import { authenticateToken } from "../middleware/auth";
import {
  checkAudioSubmissionLimit,
  checkChatMessageLimit,
} from "../middleware/middleware";
import dotenv from "dotenv";
import Note from "../models/Note";
import Recording from "../models/Recording";
import User from "../models/User";
import ChatMessage from "../models/ChatMessage";

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

router.get("/sessions/:id", async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.id;
    const recording = await Recording.findById(sessionId);
    const chatMessages = await ChatMessage.find({ recordingId: sessionId });

    console.log("Found chat messages:", chatMessages);

    if (!recording) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({
      question: recording.question,
      transcription: recording.transcription,
      analysis: recording.analysis,
      chatMessages: chatMessages[0]?.messages || [],
    });
  } catch (error) {
    console.error("Error fetching session data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/chat", async (req: Request, res: Response) => {
  console.log("Received chat request with body:", req.body);

  const { recordingId, question, transcription, analysis, input } = req.body;

  if (!recordingId || !input) {
    console.log(
      "Missing required fields. recordingId:",
      recordingId,
      "input:",
      input
    );
    return res
      .status(400)
      .json({ error: "RecordingId and input are required" });
  }

  try {
    const user = (req as any).user;
    const canChat = await checkChatMessageLimit(user._id);

    if (!canChat) {
      return res
        .status(403)
        .json({ error: "Chat message limit reached", requiresUpgrade: true });
    }

    let chatMessage = await ChatMessage.findOne({ recordingId });

    if (!chatMessage) {
      chatMessage = new ChatMessage({
        recordingId,
        messages: [],
      });
    }

    // Add user's message to the chat history
    chatMessage.messages.push({
      user: "You",
      text: input,
      timestamp: new Date(),
    });

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
          ...chatMessage.messages.map((msg) => ({
            role: msg.user === "You" ? "user" : "assistant",
            content: msg.text,
          })),
        ],
        max_tokens: 500,
      }),
    };

    const response = await axios(chatConfig);

    const reply = response.data.choices[0].message.content;

    chatMessage.messages.push({
      user: "Maxview AI",
      text: reply,
      timestamp: new Date(),
    });

    await chatMessage.save();

    // Update user's chat message count
    await User.findByIdAndUpdate(user._id, {
      $inc: { totalChatMessagesCount: 1 },
    });

    console.log("Sending chat response:", {
      reply,
      messages: chatMessage.messages,
    });
    res.json({ reply, messages: chatMessage.messages });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    res.status(500).json({ error: "Error communicating with OpenAI API" });
  }
});

router.get("/chat/:recordingId", async (req: Request, res: Response) => {
  console.log(
    "Fetching chat messages for recordingId:",
    req.params.recordingId
  );
  try {
    const chatMessage = await ChatMessage.findOne({
      recordingId: req.params.recordingId,
    });
    if (!chatMessage) {
      console.log(
        "No chat messages found for recordingId:",
        req.params.recordingId
      );
      return res.json({ messages: [] });
    }
    console.log("Sending chat messages:", chatMessage.messages);
    res.json({ messages: chatMessage.messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Error fetching chat messages" });
  }
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  console.log("Received transcribe request");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = (req as any).user;
    const canSubmit = await checkAudioSubmissionLimit(user._id);

    if (!canSubmit) {
      console.log("Audio submission limit reached for user:", user._id);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({
          error: "Audio submission limit reached",
          requiresUpgrade: true,
        });
    }

    if (!req.file) {
      console.log("No file uploaded");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = req.file.mimetype;
    if (
      !["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"].includes(fileType)
    ) {
      console.log("Invalid file type:", fileType);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Invalid file type" });
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

    console.log("Sending transcription request to OpenAI");
    const transcriptionResponse = await axios(transcriptionConfig);
    const transcription = transcriptionResponse.data;
    console.log("Received transcription:", transcription);

    if (!transcription.text) {
      throw new Error("Transcription text is empty");
    }

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

    console.log("Sending analysis request to OpenAI");
    const analysisResponse = await axios(analysisConfig);
    const analysis = analysisResponse.data.choices[0].message.content;
    console.log("Received analysis:", analysis);

    if (!analysis) {
      throw new Error("Analysis is empty");
    }

    // Create a new recording
    const newRecording = new Recording({
      question: req.body.question,
      transcription: transcription.text,
      analysis: analysis,
      date: new Date(),
    });

    await newRecording.save({ session });

    // Add the recording to user's profile
    user.recordings.push(newRecording._id);
    await user.save({ session });

    // Update user's audio submission count
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { audioSubmissionsCount: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const responseData = {
      _id: newRecording._id,
      transcription: transcription.text,
      analysis: analysis,
    };
    console.log("Sending transcribe response:", JSON.stringify(responseData));
    res.json(responseData);
    console.log("Response sent successfully");
  } catch (error) {
    console.error("Error processing audio file:", error);

    try {
      // Only abort the transaction if it hasn't been committed
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } catch (abortError) {
      console.error("Error aborting transaction:", abortError);
    } finally {
      session.endSession();
    }

    if (error instanceof Error) {
      console.log("Sending error response:", {
        error: `Error processing audio file: ${error.message}`,
      });
      res
        .status(500)
        .json({ error: `Error processing audio file: ${error.message}` });
    } else {
      console.log("Sending unknown error response");
      res
        .status(500)
        .json({
          error: "An unknown error occurred while processing the audio file",
        });
    }
  }
});

router.get("/recordings", async (req: Request, res: Response) => {
  console.log("Fetching recordings for user");
  try {
    const user = (req as any).user;
    const userProfile = await User.findById(user._id).populate("recordings");
    if (!userProfile) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Sending recordings:", userProfile.recordings);
    res.json(userProfile.recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/recordings/:id", async (req: Request, res: Response) => {
  try {
    const recordingId = req.params.id;
    const user = (req as any).user;

    // Find and delete the recording
    const deletedRecording = await Recording.findByIdAndDelete(recordingId);

    if (!deletedRecording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    // Remove the recording from the user's recordings array
    await User.findByIdAndUpdate(user._id, {
      $pull: { recordings: recordingId },
    });

    // Delete associated chat messages
    await ChatMessage.deleteOne({ recordingId });

    res.json({ message: "Recording deleted successfully" });
  } catch (error) {
    console.error("Error deleting recording:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
