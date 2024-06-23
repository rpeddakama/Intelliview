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

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("model", "whisper-1");

    const axiosConfig = {
      method: "post",
      url: "https://api.openai.com/v1/audio/transcriptions",
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY2}`,
      },
      data: formData,
    };

    console.log("AT TRANSCRIBE WOOOOOOOOOOOOOOOO");
    try {
      const response = await axios(axiosConfig);
      console.log(response.data);
      res.json({ transcription: response.data });
    } catch (error) {
      console.log("ERROR OCCURED DURING POST REQUEST", error);
    }
  } catch (error) {
    console.error("Error processing audio file:", error);
    res.status(500).send("Error processing audio file");
  }
});

export default router;
