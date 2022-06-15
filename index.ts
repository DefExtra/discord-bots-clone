import fs from "node:fs";
import { createServer } from "./server";
const config = JSON.parse(fs.readFileSync("config.def", { encoding: "utf-8" }));
import DiscordClient from "./client/DiscordClient";
import loadTheCommands from "./components/loadTheCommands";

const client = new DiscordClient({
  intents: 32767,
});
(async () => {
  await createServer(config);
  await client.login(config.bot.token);
  await loadTheCommands(client, config.bot.guildId, config);
})();

export default client;
