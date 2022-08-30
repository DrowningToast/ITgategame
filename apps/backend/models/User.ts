import mongoose from "mongoose";

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
    default: null,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["Player", "Admin", "Agency"],
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
