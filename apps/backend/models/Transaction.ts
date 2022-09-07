import mongoose, { Schema } from "mongoose";

export interface Transaction {
  type: "New" | "Reward" | "Lottery" | "Bingo";
  value: number;
  target: Schema.Types.ObjectId;
  reason: string;
  date: Date;
}

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
  date: {
    type: Date,
    default: new Date(),
  },
  reason: {
    type: String,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
