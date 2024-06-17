import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
}

const NoteSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.model<INote>("Note", NoteSchema);
