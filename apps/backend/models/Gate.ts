import mongoose from "mongoose";

const GateSchema = new mongoose.Schema({
  _id: {
    type: String,
    enum: ["AND", "OR", "NOR", "NOT"],
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  basePoints: {
    type: Number,
    default: 0,
  },
  gate: {
    type: String,
    enum: ["and", "or", "nor", "not"],
    required: true,
  },
  mvp: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
});

const Gate = mongoose.model("Gate", GateSchema);
export default Gate;
