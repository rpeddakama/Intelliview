import mongoose, { Schema, Document } from "mongoose";

export interface IRecording extends Document {
  question: string;
  transcription: string;
  analysis: string;
  date: Date;
}

const RecordingSchema: Schema = new Schema({
  question: { type: String, required: true },
  transcription: { type: String, required: true },
  analysis: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Recording = mongoose.model<IRecording>("Recording", RecordingSchema);
export default Recording;
