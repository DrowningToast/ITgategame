import { InteractionResponseType } from "discord-interactions";
import { MessageFlags } from "discord.js";
import { onewayRequest } from "../api/helper";
import { CommandHandler } from "./handler";

const GiveCommand: CommandHandler = async (message, reply) => {
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
        content: "`is thinking . . .`",
        flags: MessageFlags.Ephemeral,
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
