import mongoose from "mongoose";

const FibbageCategorySchema = new mongoose.Schema({
  name: String,
  prompt: String,
  fact: String,
  decoy: String,
});

const FibbageCategory = mongoose.model("FibbageCatory", FibbageCategorySchema);
export default FibbageCategory;
