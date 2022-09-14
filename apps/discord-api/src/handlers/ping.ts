import { InteractionResponseType } from "discord-interactions";
import { Message, MessageFlags } from "discord.js";
import { body } from "../api/type";
import { CommandHandler } from "./handler";

const PingCommand: CommandHandler = async (message, reply) => {
  const channelId = message.channel_id;
  const guildId = message.guild_id;
  const username = message.member!.user.username;

  reply({
    type: InteractionResponseType["CHANNEL_MESSAGE_WITH_SOURCE"] as number,
    data: {
      content: "Pong!",
      flags: MessageFlags.Ephemeral,
    },
  });
};

export default PingCommand;
