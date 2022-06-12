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
  name: "volume",
  description: "🎵 Changes/Shows the current volume.",
  options: [
    {
      name: "amount",
      description: "Enter value to set.",
      type: 3,
      required: false,
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
    let vol =
      isSlash == true
        ? interaction.options.getString("amount", false)
        : args?.join(" ");
    if (!vol)
      return respond(
        interaction,
        message,
        {
          content: `**Volume: \`${player.volume}\`**`,
        },
        isSlash
      );
    if (vol < 0 || vol > 150 || isNaN(vol))
      return respond(
        interaction,
        message,
        {
          content: `:no_entry_sign: **Volume must be a valid integer between 0 and 150!**`,
        },
        isSlash
      );
    respond(
      interaction,
      message,
      {
        content: `:loud_sound: **Volume changed from \`${player.volume}\` to \`${vol}\`**`,
      },
      isSlash
    );
    player.setVolume(Number(vol));
  },
};
