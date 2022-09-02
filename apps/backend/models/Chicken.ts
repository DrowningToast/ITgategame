import mongoose, { Schema } from "mongoose";

const ChickenSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "Unnamed Chicken",
  },
});

const Chicken = mongoose.model("Chicken", ChickenSchema);
export default Chicken;
