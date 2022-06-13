const { Message, CommandInteraction } = require("discord.js");
const { Manager, Player } = require("erela.js");
const { Client } = require("undici");
const ms = require("parse-ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const progressbar = require("string-progressbar");

module.exports = {
  name: "nowplaying",
  description: "🎵 Shows what song that the bot is currently playing.",
  options: [],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction | null} interaction
   * @param {Message<boolean> | null} message
   * @param {boolean} isSlash
   * @param {string[] | null} args
   * @param {Manager} manager
   */

  run: async (client, interaction, message, isSlash, args, manager) => {
    let memberVoiceChannel =
      isSlash == true
        ? interaction.guild.members.cache.get(interaction.user.id)?.voice
            ?.channel
        : message.member.voice?.channel;
    let botVoiceChannel =
      isSlash == true
        ? interaction.guild.me.voice?.channel
        : message.guild.me.voice?.channel;
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
    let player = manager.players.get(
      isSlash == true ? interaction.guildId : message.guildId
    );
    if (!player || !player.queue.current)
      return respond(
        interaction,
        message,
        {
          content: ":x: bot is not currently playing.",
        },
        isSlash
      );
    let postion = player.position;
    let dur = player.queue.current.duration;
    respond(interaction, message, {
      content: `**:notes: Now Playing in ${memberVoiceChannel.name}....**`,
      embeds: [
        {
          author: {
            name: isSlash == true ? interaction.user.tag : message.author.tag,
            iconURL:
              isSlash == true
                ? interaction.user?.avatarURL({ dynamic: true }) || ""
                : message.author?.avatarURL({ dynamic: true }) || "",
          },
          title: `**${player?.queue?.current.title}**`,
          description: `${player.paused == false ? "▶️" : "⏸️"} ${
            progressbar.splitBar(dur, postion, 12)[0]
          } \`[${
            ms(postion).minutes
          }:${
            s(ms(postion).seconds)
              ? s(ms(postion).seconds)
              : ms(postion).seconds
          }/${
            ms(dur).minutes
          }:${
            s(ms(dur).seconds)
              ? s(ms(dur).seconds)
              : ms(dur).seconds
          }]\`:loud_sound:`,
        },
      ],
    }, isSlash);
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
