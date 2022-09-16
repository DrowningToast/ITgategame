import mongoose, { Schema } from "mongoose";

const LotteryTicketSchema = new mongoose.Schema({
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
  //   pool : {
  //     type
  //   }
});

const LotteryTicket = mongoose.model("LotteryTicket", LotteryTicketSchema);
export default LotteryTicket;
