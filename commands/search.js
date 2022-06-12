const { Message, CommandInteraction } = require("discord.js");
const { Manager, Player } = require("erela.js");
const { Client } = require("undici");
const ms = require("parse-ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const config = JSON.parse(
  readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
);

module.exports = {
  name: "search",
  description: "🎵 Searches for results to play.",
  options: [
    {
      name: "song",
      description: "Song to search for.",
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
    if (!songName)
      return respond(
        interaction,
        message,
        {
          content: ":no_entry_sign: Please include a query.",
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
        await editRespond(
          interaction,
          message,
          {
            embeds: [
              {
                description: res.tracks
                  .map(
                    (track, index) =>
                      `${trunNumToEmoji(index)}\`${
                        ms(track.duration).minutes
                      }:${
                        s(ms(res.tracks[index].duration).seconds)
                          ? s(ms(res.tracks[index].duration).seconds)
                          : ms(res.tracks[index].duration).seconds
                      }\` | **${track.title}**`
                  )
                  .slice(0, 5)
                  .join("\n"),
              },
            ],
          },
          isSlash,
          m?.id
        ).then(async (d) => {
          if (isSlash == false) {
            await d.react("1️⃣");
            await d.react("2️⃣");
            await d.react("3️⃣");
            await d.react("4️⃣");
            await d.react("5️⃣");
            await d.react("❌");
            message.channel.messages.cache
              .get(d?.id)
              ?.createReactionCollector({
                filter: (args_0, args_1) => args_1.id == message?.author.id,
                max: 1,
                time: 1000 * 60 * 60 * 24,
              })
              ?.on("collect", async (reaction, user) => {
                if (reaction.emoji.name == "❌") {
                  isSlash == true
                    ? await interaction.deleteReply()
                    : await message.channel.messages.cache.get(d?.id)?.delete();
                } else {
                  await playMusic(
                    await trunEmojiToNum(reaction.emoji.name),
                    player,
                    d,
                    res,
                    interaction,
                    isSlash
                  );
                }
              });
          }
          isSlash == true
            ? interaction.channel
                .createMessageCollector({
                  filter: (args_0) =>
                    [1, 2, 3, 4, 5].includes(Number(args_0.content)) &&
                    args_0.author.id == interaction.user.id,
                  max: 1,
                  time: 1000 * 60 * 60 * 24,
                })
                ?.on("collect", async (msgg) => {
                  await playMusic(
                    Number(msgg.content),
                    player,
                    d,
                    res,
                    interaction,
                    isSlash
                  );
                })
            : message.channel
                .createMessageCollector({
                  filter: (args_0) =>
                    [1, 2, 3, 4, 5].includes(Number(args_0.content)) &&
                    args_0.author.id == message.author.id,
                  max: 1,
                  time: 1000 * 60 * 60 * 24,
                })
                ?.on("collect", async (msgg) => {
                  await playMusic(
                    Number(msgg.content),
                    player,
                    d,
                    res,
                    interaction,
                    isSlash
                  );
                });
        });
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
  } else return time;
};

const trunNumToEmoji = (index) => {
  if (index == 0) return "1️⃣";
  else if (index == 1) return "2️⃣";
  else if (index == 2) return "3️⃣";
  else if (index == 3) return "4️⃣";
  else if (index == 4) return "5️⃣";
  else return "6️⃣";
};

const trunEmojiToNum = (index) => {
  if (index == "1️⃣") return 0;
  else if (index == "2️⃣") return 1;
  else if (index == "3️⃣") return 2;
  else if (index == "4️⃣") return 3;
  else if (index == "5️⃣") return 4;
  else return 5;
};

/**
 *
 * @param {number} index
 * @param {Player} player
 * @param {Message} m
 * @param {import("erela.js").SearchResult} res
 * @param {CommandInteraction} interaction
 * @param {boolean} isSlash
 */
async function playMusic(index, player, m, res, interaction, isSlash) {
  await player.queue.add(res.tracks[index]);
  if (!player.playing && !player.paused && !player.queue.size)
    await player.play();

  if (
    !player.playing &&
    !player.paused &&
    player.queue.totalSize === res.tracks.length
  )
    await player.play();
  isSlash == false ? m.reactions.removeAll() : true;
  editRespond(
    interaction,
    m,
    {
      content: `:notes: **${
        res.tracks[index].title
      }** Added to **ProQueue** (\`${ms(res.tracks[index].duration).minutes}:${
        s(ms(res.tracks[index].duration).seconds)
          ? s(ms(res.tracks[index].duration).seconds)
          : ms(res.tracks[index].duration).seconds
      }\`)!`,
      embeds: [],
    },
    isSlash,
    m.id
  );
}
