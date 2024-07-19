import { Router, Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import FormData from "form-data";
import rateLimit from "express-rate-limit";

import { authenticateToken } from "../middleware/auth";
import {
  apiLimiter,
  checkAudioSubmissionLimit,
  checkChatMessageLimit,
} from "../middleware/middleware";
import dotenv from "dotenv";
import Recording from "../models/Recording";
import User from "../models/User";
import ChatMessage from "../models/ChatMessage";
import appConfig from "../config/config";

const upload = multer();
const router = Router();
dotenv.config();

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

    if (!recording) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Determine MIME type (you might need to store this information when saving the audio)
    const mime = recording.audio[0] === 0xff ? "audio/mpeg" : "audio/wav";

    const responseData = {
      question: recording.question,
      transcription: recording.transcription,
      analysis: recording.analysis,
      chatMessages: chatMessages[0]?.messages || [],
      audioLength: recording.audio.length,
      audioMime: mime,
    };

    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "X-JSON-Data": JSON.stringify(responseData),
    });

    res.end(recording.audio);
  } catch (error) {
    console.error("Error fetching session data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/chat", async (req: Request, res: Response) => {
  // console.log("Received chat request with body:", req.body);
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

    const chatLimit = user.isPremium
      ? appConfig.limits.premiumUser.chatMessages
      : appConfig.limits.freeUser.chatMessages;

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, totalChatMessagesCount: { $lt: chatLimit } },
      { $inc: { totalChatMessagesCount: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(403).json({
        error: "Chat message limit reached",
        requiresUpgrade: !user.isPremium,
      });
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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are responsible for answering user questions based on their interview feedback. They just answered the 
            question: ${question} and responded with ${transcription}. The overall analysis was as follows:  ${analysis}. Please 
            respond to any of their questions regarding their interview and provide valuable insights, feedback, and advice. 
            Keep your responses in the range of 2-6 sentences.`,
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
      user: "Intelliview",
      text: reply,
      timestamp: new Date(),
    });

    await chatMessage.save();

    console.log("Sending chat response:", {
      reply,
      messages: chatMessage.messages,
    });
    res.json({
      reply,
      messages: chatMessage.messages,
      remainingMessages: chatLimit - updatedUser.totalChatMessagesCount,
    });
  } catch (error: unknown) {
    console.error("Error processing chat request:", error);

    if (axios.isAxiosError(error)) {
      // This type guard narrows 'error' to AxiosError
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("OpenAI API error response:", error.response.data);
        res.status(500).json({
          error: "Error communicating with OpenAI API",
          details: error.response.data,
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from OpenAI API");
        res.status(500).json({ error: "No response received from OpenAI API" });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request to OpenAI API:", error.message);
        res
          .status(500)
          .json({ error: "Error setting up request to OpenAI API" });
      }
    } else if (error instanceof Error) {
      // For other Error instances
      console.error("Unexpected error:", error.message);
      res.status(500).json({
        error: "An unexpected error occurred",
        message: error.message,
      });
    } else {
      // For unknown error types
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "An unknown error occurred" });
    }
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
    // console.log("Sending chat messages:", chatMessage.messages);
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
    const industry = req.body.industry || "general";

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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

    const analysisPrompt = `You are responsible for providing in-depth feedback on an interview question response. 
    The user is responding to the following ${industry} interview question: ${req.body.question}. \n The user has 
    responded with: ${transcription.text}. \n Assess the quality of the response by talking about things like clarity, 
    relevance, and completeness, and more aspects you think of. Guide users in the direction of a full and correct response. 
    Give feedback on what the user did well and what they could improve on. Make sure to relate advice back to the specific 
    industry and what recruiters in that industry look for. For example, if the industry is investment banking, make sure 
    to talk about what investment banking recruiters look for in candidates. Write between 10 and 15 sentences. Space out 
    your response into small paragraphs and give a clear, concise response. Do not repeat anything I have told you. Simply 
    provide the user with new feedback on their response. Finally, make sure to end your response with: "Feel free to ask 
    me any clarifying questions!"`;

    const analysisConfig = {
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a ${industry} interview assistant.`,
          },
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
      audio: req.file.buffer, // Save the audio buffer
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
      res.status(500).json({
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

router.get("/check-audio-limit", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const canSubmit = await checkAudioSubmissionLimit(user._id);

    if (!canSubmit) {
      return res.status(403).json({
        error: "Audio submission limit reached",
        requiresUpgrade: true,
      });
    }

    res.json({ canSubmit: true });
  } catch (error) {
    console.error("Error checking audio submission limit:", error);
    res.status(500).json({ error: "Error checking audio submission limit" });
  }
});

router.get("/check-chat-limit", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const canChat = await checkChatMessageLimit(user._id);
    const totalLimit = user.isPremium
      ? appConfig.limits.premiumUser.chatMessages
      : appConfig.limits.freeUser.chatMessages;
    const remainingMessages = canChat
      ? Math.max(0, totalLimit - user.totalChatMessagesCount)
      : 0;

    res.json({
      remainingMessages,
    });
  } catch (error) {
    console.error("Error checking chat message limit:", error);
    res.status(500).json({ error: "Error checking chat message limit" });
  }
});

router.get("/profile", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userProfile = await User.findById(user._id);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: userProfile.email,
      accountTier: userProfile.isPremium ? "Premium" : "Free",
      recordingsUsed: userProfile.audioSubmissionsCount,
      recordingsLimit: userProfile.isPremium
        ? appConfig.limits.premiumUser.audioSubmissions
        : appConfig.limits.freeUser.audioSubmissions,
      chatMessagesUsed: userProfile.totalChatMessagesCount,
      chatMessagesLimit: userProfile.isPremium
        ? appConfig.limits.premiumUser.chatMessages
        : appConfig.limits.freeUser.chatMessages,
      isPremium: userProfile.isPremium,
      subscriptionStatus: userProfile.subscriptionStatus,
      subscriptionEndDate: userProfile.subscriptionEndDate,
      cancelAtPeriodEnd: userProfile.cancelAtPeriodEnd,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
