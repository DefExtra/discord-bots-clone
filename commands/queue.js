const { Message, CommandInteraction } = require("discord.js");
const { Manager } = require("erela.js");
const { Client } = require("undici");
const ms = require("parse-ms");
const { respond, editRespond } = require("../components/respond");
const { readFileSync } = require("fs");
const { title } = require("process");
const config = JSON.parse(
  readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
);

module.exports = {
  name: "queue",
  description: "🎵 Displays the queue of the current tracks in the playlist.",
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
          content: "**:frowning2: No music playing.**",
          embeds: [
            {
              title: "**:notes: Current Queue | 0 entries**",
            },
          ],
        },
        isSlash
      );
    respond(
      interaction,
      message,
      {
        content: `**:arrow_forward: ${player.queue.current.title}**`,
        embeds: [
          {
            title: "**:notes: Current Queue | 0 entries**",
            description: player.queue
              .map(
                (track, index) =>
                  `**${index + 1}** ${track.title} - <@!${track.requester.id}>`
              )
              .slice(0, 20)
              .join("\n"),
          },
        ],
      },
      isSlash
    );
  },
};
