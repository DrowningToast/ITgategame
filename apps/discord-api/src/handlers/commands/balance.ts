import { SlashCommandBuilder } from "discord.js";

export const walletCommand = new SlashCommandBuilder()
  .setName("wallet")
  .setDescription("เช็คจำนวน token ที่ตัวเองมีอยู่")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("ใครที่อยากจะเช็ค ไม่ใส่ถ้าอยากเช็คของตัวเอง")
  );

export const giveCommand = new SlashCommandBuilder()
  .setName("give")
  .setDescription("ให้ token เพื่อน ๆ ตามกำลังทรัพย์ขอบตน. . . หรือขโมย?")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("ผู้ซึ่งรับทรัพย์หรือเหยื่อ")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName("amount").setDescription("จำนวน token").setRequired(true)
  );

export const topCommand = new SlashCommandBuilder()
  .setName("top")
  .setDescription(
    "เช็คดูว่าตอนนี้ใครมี token เยอะที่สุด (คนอื่นจะไม่เห็นว่าแกกำลังแอบเช็ค)"
  );

export const grantCommand = new SlashCommandBuilder()
  .setName("grant")
  .setDescription("Grant user tokens, for AGC/CMT only")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Target to grant/deduct tokens from")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of token(s) giving to the target")
      .setRequired(true)
  );
