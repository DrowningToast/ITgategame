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

  // Check which gate are they on
  if (message.member?.roles.includes("1011597325036167268")) {
    gate = "AND";
  } else if (message.member?.roles.includes("1011597458805096492")) {
    gate = "OR";
  } else if (message.member?.roles.includes("1011597601088471100")) {
    gate = "NOR";
  } else if (message.member?.roles.includes("1011597674249715833")) {
    gate = "NOT";
  }

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
