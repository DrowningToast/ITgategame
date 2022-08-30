import mongoose, { Schema } from "mongoose";

const TransactionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
