import { InteractionResponseType } from "discord-interactions";
import { MessageFlags } from "discord.js";
import { CommandHandler } from "./handler";
import jsonwebtoken from "jsonwebtoken";

const LinkCommand: CommandHandler = async (message, reply) => {
  const channelId = message.channel_id;
  const guildId = message.guild_id;
  const id = message.member!.user.id;

  if (!process.env.BACKEND_TOKEN) throw new Error("MISSING BACKEND TOKEN");

  const jwt = await jsonwebtoken.sign(
    {
      sub: id,
    },
    process.env.BACKEND_TOKEN,
    {
      algorithm: "HS256",
    }
  );

  reply({
    type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
    data: {
      content: `กดที่ลิ้งค์เพื่อทำการเชื่อมต่อกับบัตร Gate Game บนเว็บได้เลย! ${
        process.env.DEV_URL ?? process.env.PROD_URL
      }/link?cred=${jwt}`,
      flags: MessageFlags.Ephemeral,
    },
  });
};

export default LinkCommand;
