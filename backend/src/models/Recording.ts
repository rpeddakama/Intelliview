import mongoose, { Schema, Document } from "mongoose";

export interface IRecording extends Document {
  question: string;
  transcription: string;
  analysis: string;
  date: Date;
  audio: Buffer;
}

const RecordingSchema: Schema = new Schema({
  question: { type: String, required: true },
  transcription: { type: String, required: true },
  analysis: { type: String, required: true },
  date: { type: Date, default: Date.now },
  audio: { type: Buffer, required: true },
});

const Recording = mongoose.model<IRecording>("Recording", RecordingSchema);
export default Recording;
