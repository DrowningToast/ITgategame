import { InteractionResponseType } from "discord-interactions";
import { MessageFlags } from "discord.js";
import { onewayRequest } from "../api/helper";
import { CommandHandler } from "./handler";

const GiveCommand: CommandHandler = async (message, reply) => {
  try {
    const amountParam = message.data.options!.find(
      (obj) => obj.name === "amount"
    ) as {
      name: "amount";
      value: number;
      type: 4;
    };
    const targetParam = message.data.options!.find(
      (obj) => obj.name === "target"
    ) as {
      name: "target";
      value: string;
      type: 6;
    };

    if (amountParam.value === 0) {
      return await reply({
        type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
        data: {
          content: "แก. . . จะให้ทำไม 0 token",
          flags: MessageFlags.Ephemeral,
        },
      });
    }
    if (message.member?.user.id === targetParam.value) {
      return await reply({
        type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
        data: {
          content: "แก. . . จะให้ให้ตัวทำไม",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const res = await onewayRequest(
      `${process.env.Prod_Endpoint ?? process.env.Dev_Endpoint}/defer`,
      {
        message,
        reply,
      },
      "POST"
    );

    await reply({
      type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
      data: {
        content: "กำลังทำธุรกรรมทางการเงิน. . .",
      },
    });
  } catch (e) {
    await reply({
      type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
      data: {
        content: "**Fatal errors have occured**",
        flags: MessageFlags.Ephemeral,
      },
    });
  }
};
export default GiveCommand;
