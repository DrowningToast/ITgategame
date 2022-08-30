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
});

const Gate = mongoose.model("Gate", GateSchema);
export default Gate;
