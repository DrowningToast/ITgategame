import {
  APIChatInputApplicationCommandInteraction,
  REST,
  SlashCommandBuilder,
} from "discord.js";
import express, { Response } from "express";
const app = express();
import { APIInteractionResponse, Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import { verifyKeyMiddleware } from "discord-interactions";
import { SetHeaderToken } from "./api/helper";
import { axiosBackendInstance, axiosDiscordInstance } from "./api/instance";
import PingCommand from "./handlers/ping";
import LinkCommand from "./handlers/link";
import GrantCommand from "./handlers/grant";
import DeferGrantCommand from "./handlers/defer/grant";
import WalletCommand from "./handlers/wallet";
import DeferWalletCommand from "./handlers/defer/wallet";
import GiveCommand from "./handlers/give";
import DeferGiveCommand from "./handlers/defer/give";
import TopCommand from "./handlers/top";
import DeferTopCommand from "./handlers/defer/top";
import {
  createHighLowCommand,
  endHighLowCommand,
  playHighLowCommand,
} from "./handlers/commands/highlow";
import {
  giveCommand,
  grantCommand,
  topCommand,
  walletCommand,
} from "./handlers/commands/balance";
import {
  CreateHighLowInstanceCommand,
  EndHighLowInstanceCommand,
  JoinHighLowInstanceCommand,
} from "./handlers/highlow";
import {
  DeferCreateHighLowInstanceCommand,
  DeferEndHighLowInstanceCommand,
  DeferJoinHighLowInstanceCommand,
} from "./handlers/defer/highlow";
import executeTokenCommand from "./handlers/executeToken";
import DeferExecuteTokenCommand from "./handlers/defer/executeToken";
import {
  endBountyCommand,
  startBountyCommand,
} from "./handlers/commands/bounty";
import { EndBountyCommand, StartBountyCommand } from "./handlers/bounty";
import {
  DeferEndBountyCommand,
  DeferStartBountyCommand,
} from "./handlers/defer/bounty";

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
  // Balance
  walletCommand,
  giveCommand,
  topCommand,
  grantCommand,
  // HIGHLOW
  createHighLowCommand,
  playHighLowCommand,
  endHighLowCommand,
  new SlashCommandBuilder()
    .setName("executetoken")
    .setDescription("Give tokens to members with token roles"),
  // Bounty
  startBountyCommand,
  endBountyCommand,
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
        case "give": {
          return await GiveCommand(message, reply);
        }
        case "top": {
          return await TopCommand(message, reply);
        }
        case "hl-start": {
          return await CreateHighLowInstanceCommand(message, reply);
        }
        case "hl-bet": {
          return await JoinHighLowInstanceCommand(message, reply);
        }
        case "hl-end": {
          return await EndHighLowInstanceCommand(message, reply);
        }
        case "executetoken": {
          return await executeTokenCommand(message, reply);
        }
        case "bt-start": {
          return await StartBountyCommand(message, reply);
        }
        case "bt-end": {
          return await EndBountyCommand(message, reply);
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

    console.log(message);

    if (message.type === 2 && message.member) {
      switch (commandName) {
        case "grant": {
          await DeferGrantCommand(message, rest);
          break;
        }
        case "wallet": {
          await DeferWalletCommand(message, rest);
          break;
        }
        case "give": {
          await DeferGiveCommand(message, rest);
          break;
        }
        case "top": {
          await DeferTopCommand(message, rest);
          break;
        }
        case "hl-start": {
          await DeferCreateHighLowInstanceCommand(message, rest);
          break;
        }
        case "hl-bet": {
          await DeferJoinHighLowInstanceCommand(message, rest);
          break;
        }
        case "hl-end": {
          await DeferEndHighLowInstanceCommand(message, rest);
          break;
        }
        case "executetoken": {
          await DeferExecuteTokenCommand(message, rest);
          break;
        }
        case "bt-start": {
          await DeferStartBountyCommand(message, rest);
          break;
        }
        case "bt-end": {
          await DeferEndBountyCommand(message, rest);
          break;
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
