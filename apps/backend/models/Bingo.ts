import mongoose, { Schema } from "mongoose";

const BingoSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  numbers: {
    type: [Number],
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now(),
  },
});

const Bingo = mongoose.model("Bingo", BingoSchema);
export default Bingo;
