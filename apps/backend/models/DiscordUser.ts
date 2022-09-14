import mongoose from "mongoose";

export interface iDiscordUser {
  discordId: string;
  gate: "AND" | "OR" | "NOT" | "NOR";
  balance: number;
}

const DiscordUserScshema = new mongoose.Schema({
  discordId: {
    type: String,
    requried: true,
  },
  gate: {
    type: String,
    enum: ["AND", "OR", "NOR", "NOT"],
    require: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const DiscordUser = mongoose.model("DiscordUser", DiscordUserScshema);
export default DiscordUser;
