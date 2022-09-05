import mongoose, { ObjectId } from "mongoose";

export interface iUser {
  _id: ObjectId;
  email: string;
  balance: number;
  uid: string;
  gate: string;
  firstName: string;
  lastName: string;
  userName: string;
  id: string;
  year: number;
  activated: boolean;
  role: "Player" | "Admin" | "Agency";
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  uid: {
    type: String,
    required: true,
  },
  gate: {
    type: String,
    enum: ["AND", "OR", "NOR", "NOT"],
    require: false,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  year: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["Player", "Admin", "Agency"],
  },
  activated: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
  },
  discordToken: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
