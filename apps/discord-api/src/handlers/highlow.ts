import { InteractionResponseType } from "discord-interactions";
import { MessageFlags } from "discord.js";
import { onewayRequest } from "../api/helper";
import { CommandHandler } from "./handler";

export const CreateHighLowInstanceCommand: CommandHandler = async (
  message,
  reply
) => {
  try {
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
        content: "`Starting a new game instance. . .`",
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

export const JoinHighLowInstanceCommand: CommandHandler = async (
  message,
  reply
) => {
  try {
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
        content: "`กำลังวาง token เดิมพัน. . .`",
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

export const EndHighLowInstanceCommand: CommandHandler = async (
  message,
  reply
) => {
  try {
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
        content: "`Ending HighLow instance. . .`",
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
