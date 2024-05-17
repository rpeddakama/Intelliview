import { Router } from "express";
import upload from "../middleware/upload";

const router = Router();

router.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ filePath: req.file.path, fileName: req.file.filename });
});

export default router;
