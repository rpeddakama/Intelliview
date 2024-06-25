import mongoose, { Schema, Document } from "mongoose";
import { IRecording } from "./Recording";

export interface IUser extends Document {
  email: string;
  password: string;
  recordings: IRecording[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recordings: [{ type: Schema.Types.ObjectId, ref: "Recording" }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

// import mongoose, { Document, Schema } from 'mongoose';

// export interface IUser extends Document {
//   email: string;
//   password: string;
// }

// const UserSchema: Schema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { timestamps: true });

// export default mongoose.model<IUser>('User', UserSchema);
