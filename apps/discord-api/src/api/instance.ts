import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
dotenv.config({});

/**
 * @description Axios Instance for communicating with aws function backend
 */
export const axiosBackendInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.Dev_Backend_URL
      : process.env.Prod_Backend_URL,
});

export const axiosDiscordInstance = axios.create({
  baseURL: `https://discord.com/api/v9`,
  headers: {
    Authorization: `Bot ${process.env.Discord_Token!}`,
    // ["user-agent"]: "PostmanRuntime/7.0.0",
  },
});
