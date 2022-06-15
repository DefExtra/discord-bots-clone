import { Client, ClientOptions } from "discord.js";
import fs from "node:fs";
const config = JSON.parse(fs.readFileSync(process.cwd()+"/config.def", { encoding: "utf-8" }));
export default class DiscordClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
  config() {
    return config;
  }
}
