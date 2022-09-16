import mongoose, { Schema } from "mongoose";

const LotteryTicketSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: String,
    required: true,
  },
  joined: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Lottery = mongoose.model("LotteryTicket", LotteryTicketSchema);
export default Lottery;
