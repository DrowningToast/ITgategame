// import dotenv from 'dotenv'
// import { Ijobs } from "./types/Ijobs";
// import "dotenv/config.js";

import Airtable from "airtable";
const apiKey = process.env.airtableKey ?? process.env.$airtableKey;

const airtable = new Airtable({
  apiKey: apiKey ?? process.env.NEXT_PUBLIC_airtableKey,
});

export const MainBase = airtable.base("appmXBeHb4evHo4KD");
export const AgendaBase = airtable.base("appCUJEyx5DOStNCP");
export const getMainBase = () => {
  Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: apiKey,
  });
};

export * from "./types/job";
