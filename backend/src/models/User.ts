import mongoose, { Schema, Document } from "mongoose";
import { IRecording } from "./Recording";

export interface IUser extends Document {
  email: string;
  password: string;
  recordings: IRecording["_id"][];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recordings: [{ type: Schema.Types.ObjectId, ref: "Recording" }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
