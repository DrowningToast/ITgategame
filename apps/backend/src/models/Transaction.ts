import mongoose, { Schema } from "mongoose";

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["New", "Reward", "Lottery", "Bingo"],
  },
  value: {
    type: String,
    required: true,
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reason: {
    type: String,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
