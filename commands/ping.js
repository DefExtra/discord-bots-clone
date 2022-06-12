const { Message, CommandInteraction } = require("discord.js");
const { Manager } = require("erela.js");
const { Client } = require("undici");
const { respond } = require("../components/respond");

module.exports = {
  name: "ping",
  description: "🏓 Test the bots response time.",
  options: [],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction | null} interaction
   * @param {Message<boolean> | null} message
   * @param {boolean} isSlash
   * @param {string | null} args
   * @param {Manager} manager
   */

  run: (client, interaction, message, isSlash, args, manager) => {
    respond(
      interaction,
      message,
      {
        content: "هــاي .",
      },
      isSlash
    );
  },
};
