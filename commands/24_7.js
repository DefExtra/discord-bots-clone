const { Message, CommandInteraction } = require("discord.js");
const { Manager, Player } = require("erela.js");
const { Client } = require("undici");
const ms = require("parse-ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const { QuickDB } = require("quick.db");
const config = JSON.parse(
  readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
);

module.exports = {
  name: "24_7",
  description:
    "Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it.",
  options: [],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction | null} interaction
   * @param {Message<boolean> | null} message
   * @param {boolean} isSlash
   * @param {string[] | null} args
   * @param {Manager} manager
   * @param {QuickDB} db
   */

  run: async (client, interaction, message, isSlash, args, manager, db) => {
    let memberVoiceChannel =
      isSlash == true
        ? interaction.guild.members.cache.get(interaction.user.id)?.voice
            ?.channel
        : message.member.voice?.channel;

    if (!memberVoiceChannel)
      return respond(
        interaction,
        message,
        {
          content: ":no_entry_sign: You must join a voice channel to use that!",
        },
        isSlash
      );
    if (
      (await db.get(
        `VOICE_${isSlash == true ? interaction.guildId : message.guildId}`
      )) == memberVoiceChannel.id
    ) {
      await db.delete(
        `VOICE_${isSlash == true ? interaction.guildId : message.guildId}`
      );
      respond(
        interaction,
        message,
        {
          content: `🔊 bot i'll leave this channel when you use \`/stop\` command.`,
        },
        isSlash
      );
    } else {
      await db.set(
        `VOICE_${isSlash == true ? interaction.guildId : message.guildId}`,
        memberVoiceChannel.id
      );
      respond(
        interaction,
        message,
        {
          content: `🔊 bot i'll never leave this channel.`,
        },
        isSlash
      );
    }
  },
};
