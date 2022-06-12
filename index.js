const { Client, ApplicationCommand } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { readFileSync, readdirSync } = require("fs");
const { Manager } = require("erela.js");
const config = JSON.parse(readFileSync("config.def", { encoding: "utf-8" }));
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "components/def.database.sqlite" });

const client = new Client({
  allowedMentions: {
    repliedUser: false,
  },
  intents: [
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
    "GUILDS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_INVITES",
    "GUILD_INVITES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_PRESENCES",
    "GUILD_SCHEDULED_EVENTS",
    "GUILD_VOICE_STATES",
    "GUILD_WEBHOOKS",
  ],
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "GUILD_SCHEDULED_EVENT",
    "MESSAGE",
    "REACTION",
    "USER",
  ],
});

client.login(config.token);
const commands = new Map();
const commandsSlash = [];
const manager = new Manager({
  nodes: [
    {
      host: "lavalink.oops.wtf",
      password: "www.freelavalink.ga",
      port: 2000,
      secure: false,
    },
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

manager
  .on("nodeConnect", (node) =>
    console.log(`Node "${node.options.identifier}" connected.`)
  )
  .on("nodeError", (node, error) =>
    console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    )
  );

client.on("raw", (d) => manager.updateVoiceState(d));

readdirSync("./commands/").map((file) => {
  let cmd = require("./commands/" + file);
  commands.set(cmd.name, cmd);
  commandsSlash.push({
    name: cmd.name,
    description: cmd.description,
    options: cmd.options,
    type: 1,
  });
});

client.on("ready", async () => {
  await manager.init(client.user.id);
  console.log(`Logged in as ${client.user.tag}`);
  const rest = new REST({ version: "9" }).setToken(client.token);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(client.user.id, config.guildId),
        {
          body: commandsSlash,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
  setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      let channel = await client.channels.cache.get(
        await db.get(`VOICE_${guild.id}`)
      );
      if (!channel || channel == null) return;
      let player = await manager.players.get(guild.id);
      if (player) {
        try {
          if (player.state !== "CONNECTED") await player.connect();
          await player.connect();
        } catch (err) {}
      } else {
        await manager.create({
          guild: guild.id,
          voiceChannel: channel.id,
          textChannel: guild.channels.cache.first().id,
        });
      }
    });
  }, 1000 * 5);
});

client
  .on("messageCreate", (m) => {
    if (!m.content.startsWith(config.prefix)) return;
    if (m.author.bot) return;
    if (m.channel.type == "DM") return;
    let [cmd, ...args] = m.content.split(" ");
    let cmdName = cmd.split(config.prefix).join("");
    let command = commands.get(cmdName);
    if (command) command.run(client, null, m, false, args, manager, db);
  })
  .on("interactionCreate", (i) => {
    if (i.isCommand()) {
      let cmdName = i.commandName;
      let command = commands.get(cmdName);
      if (command) command.run(client, i, null, true, null, manager, db);
    }
  });
