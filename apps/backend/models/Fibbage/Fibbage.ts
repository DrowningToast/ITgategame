import mongoose from "mongoose";

const FibbageSchema = new mongoose.Schema({
  onGoing: {
    type: Boolean,
  },
  baseBet: {
    type: Number,
    required: true,
    default: 0,
  },
  // Who bets what
  bets: [
    {
      owner: String,
      choice: String,
    },
  ],
  prompt: {
    type: String,
    required: true,
  },
  participants: [
    {
      owner: {
        type: String,
      },
      choice: {
        type: String,
      },
    },
  ],
  phase: {
    type: String,
    enum: ["IDLE", "PREGAME", "SUBMIT", "BET", "REVEAL", "END"],
    default: "IDLE",
  },
  // ALl choices pool
  choices: [String],
  // Filtered pool selected by mod
  approvedChoices: [String],
  truth: {
    type: String,
    required: true,
  },
  decoy: {
    type: String,
    required: true,
  },
  totalBet: {
    type: Number,
    default: 0,
  },
  // Players who correctly blind guess
  fastTrackWinners: [String],
});

const Fibbage = mongoose.model("Fibbage", FibbageSchema);
export default Fibbage;
