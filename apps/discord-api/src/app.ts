import {
  APIChatInputApplicationCommandInteraction,
  Interaction,
  InteractionResponse,
  InteractionWebhook,
  Message,
  REST,
  SlashCommandBuilder,
} from "discord.js";
import express, { Response } from "express";
const app = express();
import {
  APIApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIWebhook,
  RESTGetAPIWebhookResult,
  Routes,
} from "discord-api-types/v9";
import dotenv from "dotenv";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { body } from "./api/type";
import { SetHeaderToken } from "./api/helper";
import { axiosBackendInstance, axiosDiscordInstance } from "./api/instance";
import PingCommand from "./handlers/ping";
import LinkCommand from "./handlers/link";
import GrantCommand from "./handlers/grant";
import DeferGrantCommand from "./handlers/defer/grant";
import WalletCommand from "./handlers/wallet";
import DeferWalletCommand from "./handlers/defer/wallet";

dotenv.config({});

if (!process.env.BOT_TOKEN) throw new Error("Missing bot token");
if (!process.env.CLIENT_ID) throw new Error("Missing Client Id");
if (!process.env.PUBLIC_KEY) throw new Error("Missing Public Key");
if (!process.env.BACKEND_TOKEN) throw new Error("Missing Backend Token");

SetHeaderToken(axiosBackendInstance, process.env.BACKEND_TOKEN);

// Command lists
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Test pinging"),
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link to the web account"),
  new SlashCommandBuilder()
    .setName("grant")
    .setDescription("Grant user tokens, for AGC/CMT only")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Target to grant/deduct tokens from")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of token(s) giving to the target")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("give")
    .setDescription("ให้ token เพื่อน ๆ ตามกำลังทรัพย์ขอบตน. . . หรือขโมย?"),
  new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("เช็คจำนวน token ที่ตัวเองมีอยู่"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

const sendResponse =
  (res: Response) => async (interactionResponse?: APIInteractionResponse) => {
    res.send(interactionResponse);
    return;
  };

app.get("/favicon.ico", async (req, res, next) => {
  res.status(200).end();
});

app.get("/setup", async (req, res, next) => {
  try {
    // console.log(process.env.CLIENT_ID!);
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        "1008741886732800011"
      ),
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

app.use(express.raw());
app.use("/command", verifyKeyMiddleware(process.env.PUBLIC_KEY!));
app.use(express.json());

app.post("/command", async (req, res, next) => {
  try {
    const message: APIChatInputApplicationCommandInteraction = req.body;
    const commandName = message?.data?.name ?? undefined;
    if (!commandName) {
      return res.sendStatus(500);
    }
    const channelId = message.channel_id;
    const guildId = message.guild_id;
    const username = message.member!.user.username;

    const reply = sendResponse(res);

    // The function logics
    if (message.type === 2 && message.member) {
      switch (commandName) {
        case "ping": {
          return await PingCommand(message, reply);
        }
        case "link": {
          return await LinkCommand(message, reply);
        }
        case "grant": {
          return await GrantCommand(message, reply);
        }
        case "wallet": {
          return await WalletCommand(message, reply);
        }
      }
    }
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

app.post<
  "/defer",
  any,
  {
    message: APIChatInputApplicationCommandInteraction;
    reply: (
      interactionResponse?: APIInteractionResponse | undefined
    ) => Promise<any>;
  }
>("/defer", async (req, res, next) => {
  try {
    const message: APIChatInputApplicationCommandInteraction = req.body.message;
    const commandName = message?.data?.name ?? undefined;

    // const channelId = message.channel_id;
    // const guildId = message.guild_id;
    // const username = message.member!.user.username;

    if (message.type === 2 && message.member) {
      switch (commandName) {
        case "grant": {
          await DeferGrantCommand(message, rest);
        }
        case "wallet": {
          await DeferWalletCommand(message, rest);
        }
      }
    }

    res.sendStatus(200);
  } catch (e) {
    console.log("error!");
    console.log(e);
    res.sendStatus(500);
  }
});

export default app;
