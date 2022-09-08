import { IntentOptions } from "config/IntentOptions";
import { Client } from "discord.js";

(async () => {
  const BOT = new Client({
    intents: IntentOptions,
  });

  await BOT.login(process.env.BOT_TOKEN);
})();
