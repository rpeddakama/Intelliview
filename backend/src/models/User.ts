import mongoose, { Schema, Document } from "mongoose";
import { IRecording } from "./Recording";

export interface IUser extends Document {
  email: string;
  password: string;
  recordings: IRecording["_id"][];
  audioSubmissionsCount: number;
  totalChatMessagesCount: number;
  isPremium: boolean;
  isVerified: boolean;
  verificationToken: string | null;
  subscriptionStatus: string;
  subscriptionEndDate: Date | null;
  cancelAtPeriodEnd: boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recordings: [{ type: Schema.Types.ObjectId, ref: "Recording" }],
  audioSubmissionsCount: { type: Number, default: 0 },
  totalChatMessagesCount: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  subscriptionStatus: { type: String, default: "none" },
  subscriptionEndDate: { type: Date, default: null },
  cancelAtPeriodEnd: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema);
