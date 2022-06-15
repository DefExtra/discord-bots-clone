import { CommandInteraction, Message } from "discord.js";
import fs from "node:fs";
import DiscordClient from "../client/DiscordClient";
import { QuickDB } from "quick.db";
const db = new QuickDB({ filePath: process.cwd() + "/def.database.sqlite" });
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const commandDir = fs.readdirSync(process.cwd() + "/commands/");
const commands = new Map();

export default async (client: DiscordClient, guildId: string, config: any) => {
  client
    .on("messageCreate", async (m) => {
      let g = client.guilds.cache.get(guildId);
      let emoji = g?.emojis.cache.find((e) => e.name == "gyaybot");
      if (!emoji)
        g?.emojis.create(
          "https://cdn.discordapp.com/emojis/585696613507399692.webp?size=128&quality=lossless",
          "gyaybot"
        );
      if (m.author.bot) return;
      if (m.channel.type == "DM") return;
      if (!m.content.startsWith(config.bot.prefix)) return;
      let [cmd, ...args] = m.content.split(" ");
      let cmdName = cmd.split(config.bot.prefix).join("");
      if (
        m.member?.permissions.has("MANAGE_GUILD") ||
        m.member?.roles.cache.find((r) => r.name == "Giveaways")
      ) {
        await commands.get(cmdName)?.run(client, null, m, false, db);
      } else
        m.reply(
          '💥 You must have the Manage Server permission, or a role called "Giveaways", to use this command!'
        );
    })
    .on("interactionCreate", async (m) => {
      let g = client.guilds.cache.get(guildId);
      let emoji = g?.emojis.cache.find((e) => e.name == "gyaybot");
      if (!emoji)
        g?.emojis.create(
          "https://cdn.discordapp.com/emojis/585696613507399692.webp?size=128&quality=lossless",
          "gyaybot"
        );
      if (m.user.bot) return;
      if (!m.isCommand()) return;
      if (m.channel?.type == "DM") return;
      if (
        m.guild?.members.cache
          .get(m.user.id)
          ?.permissions.has("MANAGE_GUILD") ||
        m.guild?.members.cache
          .get(m.user.id)
          ?.roles.cache.find((r) => r.name == "Giveaways")
      ) {
        await commands.get(m.commandName)?.run(client, m, null, true, db);
      } else {
        m.reply(
          '💥 You must have the Manage Server permission, or a role called "Giveaways", to use this command!'
        );
      }
    });
  await getCommands();
  await registerCommands(client, guildId);
  return commands;
};

const registerCommands = async (client: DiscordClient, guildId: string) => {
  let commandsArray: any[] = [];
  await commands.forEach((t) => {
    if (t?.options) {
      commandsArray.push({
        name: t.name,
        description: t.description,
        type: 1,
        options: t.options,
      });
    } else {
      commandsArray.push({
        name: t.name,
        description: t.description,
        type: 1,
      });
    }
  });

  const rest = new REST({ version: "9" }).setToken(client.token || "");

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(client.user?.id || "", guildId),
        {
          body: commandsArray,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
};

const getCommands = async () => {
  await commandDir.map(async (file) => {
    let commandFile: {
      default: {
        name: string;
        description: string;
        options: any[];

        run: (
          client: DiscordClient,
          interaction: CommandInteraction,
          message: Message,
          isSlash: boolean
        ) => void;
      };
    } = await import(process.cwd() + "/commands/" + file);
    commands.set(commandFile.default.name, commandFile.default);
  });
};
