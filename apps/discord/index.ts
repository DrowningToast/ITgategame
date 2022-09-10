import { REST } from "@discordjs/rest";
import { api, data, schedule, params } from "@serverless/cloud";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "discord.js";

// Command lists
const commands = [
  {
    name: "ping",
    description: "Ping for testing",
  },
  new SlashCommandBuilder().setName("link"),
];

const rest = new REST({ version: "9" }).setToken(params.BOT_TOKEN);

api.get("/set-commands", async (req, res) => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(params.CLIENT_ID, "1008741886732800011"),
      {
        body: commands,
      }
    );
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

const sendResponse = (res: any) => (content: string) => {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
    },
  });
};

api.post(
  "/discord",
  api.rawBody,
  verifyKeyMiddleware(params.PUBLIC_KEY),
  async (req, res) => {
    const message = req.body;
    const commandName = message.data.name ?? undefined;
    if (!commandName) {
      return res.sendStatus(500);
    }
    const channelId = message.channel_id;
    const guildId = message.guild_id;
    const username = message.member.user.username;

    const reply = sendResponse(res);

    // The function logics
    if (message.type === InteractionType.APPLICATION_COMMAND) {
      switch (commandName) {
        case "ping": {
          return reply("Pong");
        }
      }
    }
    return res.sendStatus(200);
  }
);
