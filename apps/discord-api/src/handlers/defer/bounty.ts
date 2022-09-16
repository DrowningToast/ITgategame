import { Routes } from "discord.js";
import { axiosBackendInstance } from "../../api/instance";
import { iUser } from "../../api/type";
import EncodeObject from "../../cred/encode";
import { DeferCommandHandler } from "../handler";

interface IBountyInstance {
  owner: string;
  price: number;
  joined: number;
  channelId: string;
  messageId: string;
  onGoing: boolean;
  limit: number;
  member: string[];
}

export const DeferStartBountyCommand: DeferCommandHandler = async (
  message,
  rest
) => {
  const amountParam = message.data.options?.find(
    (option) => option.name === "amount"
  ) as {
    name: "amount";
    value: number;
  };

  const limitParam = message.data.options?.find(
    (option) => option.name === "limit"
  ) as {
    name: "limit";
    value?: number;
  };

  try {
    const editedMessage = (await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**ด่วนที่สุด ด่วนมาก ๆ ด่วนไฟลุก :fire:** ใครกดหัวใจข้อความนี้แจก **${
            amountParam.value
          }** tokens! ${
            limitParam
              ? ` **สุ่มแจกเพียงแค่${limitParam?.value}คนเท่านั้น**`
              : ""
          }`,
        },
      }
    )) as any;

    const response = await axiosBackendInstance.post<IBountyInstance>(
      "/discord/bounty",
      {
        jwt: await EncodeObject({
          creatorId: message.member?.user.id,
          channelId: message.channel_id,
          tokens: amountParam.value,
          limit: limitParam?.value ?? undefined,
          messageId: editedMessage.id,
        }),
      }
    );

    await rest.put(
      Routes.channelMessageOwnReaction(
        message.channel_id,
        editedMessage.id,
        "❤"
      )
    );
  } catch (e) {
    console.log(e);
    console.log(e.response?.data);
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

export const DeferEndBountyCommand: DeferCommandHandler = async (
  message,
  rest
) => {
  try {
    // Get stored information about the bounty
    const bounty = await axiosBackendInstance.get<IBountyInstance>(
      `/discord/bounty/${await EncodeObject(message.channel_id)}`
    );

    // Get all reactions
    const targets = (await rest.get(
      `${Routes.channelMessageReaction(
        message.channel_id,
        bounty.data.messageId,
        "❤"
      )}?limit=100`
    )) as {
      id: string;
    }[];

    const targetId = targets
      .map((target) => target.id)
      .filter((target) => target !== "1017515750476501053");

    // update users balance
    const users = await axiosBackendInstance.patch<{
      instance: IBountyInstance;
      users: iUser[];
    }>("/discord/bounty/end", {
      jwt: await EncodeObject({
        creatorId: message.member?.user.id,
        channelId: message.channel_id,
        targetId: targetId,
      }),
    });

    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `ใครเร็วใครได้! :fire::fire::fire: Bounty เมื่อกี้มีมูลค่า ${
            bounty.data.price
          } token(s) และมี${
            bounty.data.price > 0 ? "คนเข้าร่วม" : "คนตาถั่ว"
          }ถึง ${targetId.length} คน ${
            targetId.length
              ? `${
                  bounty.data?.limit
                    ? `แค่มีผู้ถูกเลือกเพียงแค่ ${bounty.data?.limit} คน ได้แก่!!`
                    : "ได้แก่!!"
                }`
              : ""
          }\n${targetId.map((id) => ` - <@${id}>\n`)}`,
          //   content: "Done!",
        },
      }
    );
  } catch (e) {
    console.log(e.response);
    console.log(e);
    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**Failed to update user tokens** Reason: ${e?.response?.data}`,
        },
      }
    );
  }
};
