import { SlashCommandBuilder } from "discord.js";

export const startBountyCommand = new SlashCommandBuilder()
  .setName("bt-start")
  .setDescription("Start a bounty in this text channel, for AGC only")
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("amount of token the participants win")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("limit")
      .setDescription(
        "Limit amount of participants, if exceed, will randomize winners, default: none"
      )
  );

export const endBountyCommand = new SlashCommandBuilder()
  .setName("bt-end")
  .setDescription("End a bounty instance in this text channel");
