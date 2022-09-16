import { SlashCommandBuilder } from "discord.js";

export const playHighLowCommand = new SlashCommandBuilder()
  .setName("hl-bet")
  .setDescription("วางเงินว่าจะพนันสูงหรือต่ำตามราคาของเกมที่ได้เปิด")
  .addStringOption((option) =>
    option
      .setName("choice")
      .setDescription("เลือก High (สูง) หรือ Low (ต่ำ)")
      .setRequired(true)
      .addChoices(
        {
          name: "High",
          value: "HIGH",
        },
        {
          name: "Low",
          value: "LOW",
        },
        {
          name: "Center",
          value: "CENTER",
        }
      )
  );

export const createHighLowCommand = new SlashCommandBuilder()
  .setName("hl-start")
  .setDescription("Start a new high/low game while providing the entry cost")
  .addNumberOption((option) =>
    option
      .setName("cost")
      .setDescription("Entry cost needed to be paid before entering the game")
      .setRequired(true)
  );

export const endHighLowCommand = new SlashCommandBuilder()
  .setName("hl-end")
  .setDescription("End a started high low game instance")
  .addStringOption((option) =>
    option
      .setName("side")
      .setDescription("Which side won")
      .setRequired(true)
      .addChoices(
        {
          name: "High",
          value: "HIGH",
        },
        {
          name: "Low",
          value: "LOW",
        },
        {
          name: "Center",
          value: "CENTER",
        }
      )
  );
