import mongoose, { Schema } from "mongoose";

const HighLowSchema = new mongoose.Schema({
  owner: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  joined: {
    type: Number,
    required: true,
    default: 0,
  },
  messageId: {
    type: String,
    required: true,
  },
  onGoing: {
    type: Boolean,
    required: true,
    default: true,
  },
  // discordId
  high: [
    {
      type: String,
      default: [],
    },
  ],
  // discordId
  low: [
    {
      type: String,
      default: [],
    },
  ],
  // discord
  center: [
    {
      type: String,
      default: [],
    },
  ],
});

const HighLow = mongoose.model("HighLow", HighLowSchema);
export default HighLow;
