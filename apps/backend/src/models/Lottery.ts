import mongoose, { Schema } from "mongoose";

const LotterySchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  number: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now(),
  },
});

const Lottery = mongoose.model("Lottery", LotterySchema);
export default Lottery;
