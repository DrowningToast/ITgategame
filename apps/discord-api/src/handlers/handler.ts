import {
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types/v9";
import { REST } from "discord.js";

export type CommandHandler = (
  message: APIChatInputApplicationCommandInteraction,
  reply: (interactionResponse?: APIInteractionResponse) => Promise<any>
) => Promise<void>;

export type DeferCommandHandler = (
  message: APIChatInputApplicationCommandInteraction,
  rest: REST
) => Promise<any>;
