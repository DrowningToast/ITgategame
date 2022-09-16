import { APIGuildMember, Routes } from "discord.js";
import { DeferCommandHandler } from "../handler";

import dotenv from "dotenv";
import { getTokenFromRole } from "../../misc/roles";
import { axiosBackendInstance } from "../../api/instance";
import EncodeObject from "../../cred/encode";
import { iUser } from "../../api/type";
dotenv.config({});

const DeferExecuteTokenCommand: DeferCommandHandler = async (message, rest) => {
  try {
    if (!process.env.GUILD_ID) throw new Error("MISSING GUILD ID");

    // Get all users
    const users = (await rest.get(
      `${Routes.guildMembers(process.env.GUILD_ID!)}?limit=1000`
    )) as APIGuildMember[];

    const affectedUsers: { user: iUser; inc: number }[] = [];

    // Grant
    await Promise.all(
      users.map(async (user) => {
        const { total: tokens, roles } = await getTokenFromRole(user);
        if (tokens === 0) return;
        console.log(`${user.nick} ${tokens} ${roles}`);
        const responseUsers = await axiosBackendInstance.post<iUser>(
          "/discord/grant",
          {
            jwt: await EncodeObject({
              requesterDiscordId: message.member?.user.id,
              discordId: user.user?.id,
              amount: tokens,
            }),
          }
        );
        affectedUsers.push({ user: responseUsers.data, inc: tokens });
        // Remove roles
        await Promise.all(
          roles.map(async (role) => {
            await rest.delete(
              Routes.guildMemberRole(
                process.env.GUILD_ID!,
                user.user?.id!,
                role
              )
            );
          })
        );
      })
    );

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `ให้คะแนน/ตัดคะแนนเสร็จแล้วค้าบ :tada::tada::tada: \n${affectedUsers.map(
            (info) =>
              `<@${info.user.discordId}> ${
                info.inc > 0 ? "ได้รับเพิ่มไป" : "โดนหักไป"
              } ${info.inc} tokens\n`
          )}`,
        },
      }
    );
  } catch (e) {
    console.log(e.response.data);
    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**ไม่นะ! บอทมันก่องก้อง บัครับประทาน ลองติดต่อ Staff ดูน้า** เหตุผล: ${e?.response?.data}`,
        },
      }
    );
  }
};
export default DeferExecuteTokenCommand;
