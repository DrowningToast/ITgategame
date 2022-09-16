import { AxiosInstance } from "axios";

/**
 * @description Attach the firebase token to every request to the backend
 * @param instance
 * @param bearer
 */
export const SetHeaderToken = (instance: AxiosInstance, token: string) => {
  instance.defaults.headers.common["token"] = token;
};

import https from "https";
import http from "http";
import URL from "url";
import { DeferCommandHandler } from "../handlers/handler";
import {
  APIChatInputApplicationCommandInteraction,
  REST,
  Routes,
} from "discord.js";
import { axiosBackendInstance } from "./instance";
import EncodeObject from "../cred/encode";
import { APIGuildMember } from "discord-api-types/v9";

export async function onewayRequest(url: string, data, method = "GET") {
  return new Promise((resolve, reject) => {
    try {
      let dataEncoded = JSON.stringify(data);
      let req: http.ClientRequest;
      if (process.env.Prod_Endpoint) {
        console.log("HTTPSING");
        req = https.request({
          ...URL.parse(url),
          method,
          headers: {
            "Content-Length": Buffer.byteLength(dataEncoded),
            "Content-Type": "application/json",
          },
        });
      } else {
        req = http.request({
          ...URL.parse(url),
          method,
          headers: {
            "Content-Length": Buffer.byteLength(dataEncoded),
            "Content-Type": "application/json",
          },
        });
      }
      req.method = method;
      req.write(JSON.stringify(data));
      req.end(() => {
        /* Request has been fully sent */
        resolve(req);
      });
    } catch (e) {
      console.log("Something went wrong");
      console.log(e);
      reject(e);
    }
  });
}

export const createTempAccount = async (
  message: APIChatInputApplicationCommandInteraction,
  rest: REST,
  discordId: string
) => {
  let gate: "AND" | "OR" | "NOR" | "NOT" | null = null;

  const target = (await rest.get(
    Routes.guildMember(process.env.GUILD_ID!, discordId)
  )) as APIGuildMember;

  // Check which gate are they on
  if (target?.roles.includes("1011597325036167268")) {
    // 1011597325036167268
    gate = "AND";
  } else if (target?.roles.includes("1011597458805096492")) {
    // 1011597458805096492
    gate = "OR";
  } else if (target?.roles.includes("1011597601088471100")) {
    // 1011597601088471100
    gate = "NOR";
  } else if (target?.roles.includes("1011597674249715833")) {
    // 1011597674249715833
    gate = "NOT";
  }

  console.log(target?.nick);
  console.log(target?.roles);
  console.log(gate);

  if (!gate) {
    await rest.patch(
      Routes.webhookMessage(process.env.APP_ID!, message.token),
      {
        body: {
          content: `**Failed to update user tokens** Reason: Target missing a unqiue gate role`,
        },
      }
    );
    return;
  }

  await axiosBackendInstance.post("/discord/create", {
    jwt: await EncodeObject({
      discordId,
      gate,
    }),
  });

  return;
};
