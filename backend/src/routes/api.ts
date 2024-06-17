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

export default router;
