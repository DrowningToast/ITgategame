import axios, { AxiosError } from "axios";
import { APIApplicationCommandIntegerOption } from "discord-api-types/v9";
import { InteractionResponseType } from "discord-interactions";
import {
  APIApplicationCommandInteractionDataIntegerOption,
  MessageFlags,
} from "discord.js";
import { onewayRequest } from "../api/helper";
import { axiosBackendInstance } from "../api/instance";
import EncodeObject from "../cred/encode";
import { CommandHandler } from "./handler";

const GrantCommand: CommandHandler = async (message, reply) => {
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
export default GrantCommand;
