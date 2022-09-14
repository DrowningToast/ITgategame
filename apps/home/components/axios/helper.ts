import axios, { AxiosInstance } from "axios";

/**
 * @description Axios Instance for communicating with Azure function backend
 */
export const axiosBackendInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_Dev_Backend_URL
      : process.env.NEXT_PUBLIC_Prod_Backend_URL,
});

if (!process.env.NEXT_PUBLIC_Discord_Token)
  throw new Error("Missing env variable discord token");

export const axiosDiscordInstance = axios.create({
  baseURL: `https://discord.com/api/v10`,
  headers: {
    Authorization: `Bot ${process.env.NEXT_PUBLIC_Discord_Token!}`,
    ["user-agent"]: "PostmanRuntime/7.0.0",
  },
});

// axiosBackendInstance.defaults.headers.common.[]

/**
 * @description Attach the firebase token to every request to the backend
 * @param instance
 * @param bearer
 */
export const SetDefaultHeader = (instance: AxiosInstance, bearer: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${bearer}`;
};
