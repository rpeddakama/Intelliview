import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  recordingId: mongoose.Types.ObjectId;
  messages: {
    user: string;
    text: string;
    timestamp: Date;
  }[];
}

const ChatMessageSchema: Schema = new Schema({
  recordingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recording",
    required: true,
  },
  messages: [
    {
      user: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
export default ChatMessage;
