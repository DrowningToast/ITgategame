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

  if (process.env.PROD_URL) {
    reply({
      type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
      data: {
        content: `กดที่ลิ้งค์เพื่อทำการเชื่อมต่อกับบัตร Gate Game บนเว็บได้เลย! ${
          process.env.DEV_URL ?? process.env.PROD_URL
        }/link?cred=${jwt}`,
        flags: MessageFlags.Ephemeral,
      },
    });
  } else {
    reply({
      type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
      data: {
        content: `ตอนนี้กำลังปรับปรุงบอทอยู่จ้า ไว้เดี๋ยวค่อยมาลิ้งค์น้า (token ที่มีอยู่ก่อนลิ้งค์จะไม่หายไปไหน)`,
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  // reply({
  //   type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
  //   data: {
  //     content: `กดที่ลิ้งค์เพื่อทำการเชื่อมต่อกับบัตร Gate Game บนเว็บได้เลย! ${
  //       process.env.DEV_URL ?? process.env.PROD_URL
  //     }/link?cred=${jwt}`,
  //     flags: MessageFlags.Ephemeral,
  //   },
  // });

  // reply({
  //   type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
  //   data: {
  //     content: `ตอนนี้กำลังซ่อมบอทอยู่จ้า ไว้เดี๋ยวค่อยมาลิ้งค์น้า (token ที่มีอยู่ก่อนลิ้งค์จะไม่หายไปไหน)`,
  //     flags: MessageFlags.Ephemeral,
  //   },
  // });
};

export default LinkCommand;
