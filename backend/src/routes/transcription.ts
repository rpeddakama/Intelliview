import { Router } from "express";
import upload from "../middleware/upload";
import transcribeAudio from "../services/transcription";

const router = Router();

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  //   console.log("Request File:", req.file); // Debugging line to log file information

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const transcription = await transcribeAudio(req.file.path);
    res.json({ transcription });
  } catch (error) {
    // console.error("Error transcribing audio:", error);
    res.status(500).json({ message: "Error transcribing audio", error });
  }
});

export default router;
