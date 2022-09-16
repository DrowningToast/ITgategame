import mongoose from "mongoose";

const BountySchema = new mongoose.Schema({
  owner: {
    type: String,
  },
  price: {
    type: Number,
    requierd: true,
    default: 0,
  },
  joined: {
    type: Number,
    required: true,
    default: 0,
  },
  channelId: {
    type: String,
    required: true,
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
  limit: {
    type: Number,
  },
  members: [
    {
      type: String,
    },
  ],
});

const Bounty = mongoose.model("Bounty", BountySchema);
export default Bounty;
