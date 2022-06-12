const { Message, CommandInteraction } = require("discord.js");
const { Manager, Player } = require("erela.js");
const { Client } = require("undici");
const ms = require("ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const config = JSON.parse(
  readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
);

module.exports = {
  name: "seek",
  description: "🎵 Seeks to a certain point in the current track.",
  options: [
    {
      name: "position",
      description: "Seeks to a certain point.",
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

  run: async(client, interaction, message, isSlash, args, manager) => {
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
          content: ":no_entry_sign: There must be music playing to use that!",
        },
        isSlash
      );
    let position =
      isSlash == true
        ? interaction.options.getString("position", true)
        : args?.join(" ");
    if (!position) return respond(
        interaction,
        message,
        {
          content: ":rolling_eyes: - Example `/seek 2m`",
        },
        isSlash
      );
    await player.seek(ms(position));
    isSlash == true ? interaction.reply("🎶") : message.react("🎶");
  },
};
