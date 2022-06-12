const { Message, CommandInteraction } = require("discord.js");
const { Manager } = require("erela.js");
const { Client } = require("undici");
const ms = require("parse-ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const config = JSON.parse(
  readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
);

module.exports = {
  name: "play",
  description: "🎵 Add a song to queue and plays it.",
  options: [
    {
      name: "song",
      description: "Song to search for or the link of the song.",
      type: 3,
      required: true,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction | null} interaction
   * @param {Message<boolean> | null} message
   * @param {boolean} isSlash
   * @param {string[] | null} args
   * @param {Manager} manager
   */

  run: (client, interaction, message, isSlash, args, manager) => {
    let memberVoiceChannel =
      isSlash == true
        ? interaction.guild.members.cache.get(interaction.user.id)?.voice
            ?.channel
        : message.member.voice?.channel;
    let botVoiceChannel =
      isSlash == true
        ? interaction.guild.me.voice?.channel
        : message.guild.me.voice?.channel;
    let songName =
      isSlash == true
        ? interaction.options.getString("song", true)
        : args?.join(" ");
    if (!memberVoiceChannel)
      return respond(
        interaction,
        message,
        {
          content: ":no_entry_sign: You must join a voice channel to use that!",
        },
        isSlash
      );
    if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id)
      return respond(
        interaction,
        message,
        {
          content: `:no_entry_sign: You must be listening in **${botVoiceChannel.name}** to use that!`,
        },
        isSlash
      );
    if (
      manager.players.get(
        isSlash == true ? interaction.guildId : message.guildId
      )?.paused &&
      !songName
    ) {
      manager.players
        .get(isSlash == true ? interaction.guildId : message.guildId)
        ?.pause(false);
      respond(
        interaction,
        message,
        {
          content: `:notes: Resumed **${
            manager.players.get(
              isSlash == true ? interaction.guildId : message.guildId
            )?.queue?.current?.title
          }**`,
        },
        isSlash
      );
      return;
    } else if (
      manager.players.get(
        isSlash == true ? interaction.guildId : message.guildId
      )?.paused &&
      songName
    )
      manager.players
        .get(isSlash == true ? interaction.guildId : message.guildId)
        ?.pause(false);
    if (!songName)
      return respond(
        interaction,
        message,
        {
          embeds: [
            {
              title: "**Command: play**",
              description: "Add a song to queue and plays it.",
              fields: [
                {
                  name: "**Aliases:**",
                  value: `${config.prefix}p, ${config.prefix}resume`,
                },
                {
                  name: "**Usage:**",
                  value: `${config.prefix}play [song title] - plays the first result from Youtube\n${config.prefix}play [URL] - plays the provided song, playlist, or stream`,
                },
                {
                  name: "**Examples:**",
                  value: `${config.prefix}play Havana\n${config.prefix}play https://www.youtube.com/watch?v=HCjNJDNzw8Y`,
                },
              ],
            },
          ],
        },
        isSlash
      );
    respond(
      interaction,
      message,
      {
        content: `⌚ Searching ... (\`${songName}\`)`,
      },
      isSlash
    ).then(async (m) => {
      try {
        let res = await manager.search(
          songName,
          isSlash == true ? interaction.user : message.author
        );
        if (res.loadType == "LOAD_FAILED") return m.react("❌");
        else if (res.loadType == "NO_MATCHES") return m.react("❌");

        const player = await manager.create({
          guild: isSlash == true ? interaction.guild.id : message.guild.id,
          voiceChannel: memberVoiceChannel.id,
          textChannel:
            isSlash == true ? interaction.channel.id : message.channel.id,
        });
        await player.connect();
        await player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.size)
          await player.play();

        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          await player.play();
        editRespond(
          interaction,
          message,
          {
            content: `:notes: **${
              res.tracks[0].title
            }** Added to **ProQueue** (\`${
              ms(res.tracks[0].duration).minutes
            }:${
              s(ms(res.tracks[0].duration).seconds)
                ? s(ms(res.tracks[0].duration).seconds)
                : ms(res.tracks[0].duration).seconds
            }\`)!`,
          },
          isSlash,
          m?.id
        );
      } catch (err) {
        editRespond(
          interaction,
          message,
          {
            embeds: [
              {
                color: "RED",
                description: `**there was an error while searching**: \`\`\`\n${err.message}\`\`\``,
              },
            ],
          },
          isSlash,
          m?.id
        );
      }
    });
  },
};

const s = (time) => {
  if (time == 1) {
    return "01";
  } else if (time == 2) {
    return "02";
  } else if (time == 3) {
    return "03";
  } else if (time == 4) {
    return "04";
  } else if (time == 5) {
    return "05";
  } else if (time == 6) {
    return "06";
  } else if (time == 7) {
    return "07";
  } else if (time == 8) {
    return "08";
  } else if (time == 9) {
    return "09";
  } else if (time == 0) {
    return "00";
  }
};
