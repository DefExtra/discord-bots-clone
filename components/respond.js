module.exports = {
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Message} message
   * @param {import("discord.js").InteractionReplyOptions} data
   * @param {boolean} isSlash
   * @returns {import("discord.js").Message}
   */

  respond: async function respond(interaction, message, data, isSlash) {
    if (isSlash == true) {
      return interaction
        .reply(data)
        .then((d) => {
          return d;
        })
        .catch((d) => {
          return d;
        });
    } else {
      return message
        .reply(data)
        .then((d) => {
          return d;
        })
        .catch((d) => {
          return d;
        });
    }
  },
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Message} message
   * @param {import("discord.js").InteractionReplyOptions} data
   * @param {boolean} isSlash
   * @param {string} msgId
   */
  editRespond: (interaction, message, data, isSlash, msgId) =>
    isSlash == true
      ? interaction
          .editReply(data)
          .then((d) => d)
          .catch((d) => d)
      : message.channel.messages.cache
          .find((m) => m.id == msgId)
          ?.edit(data)
          .then((d) => d)
          .catch((d) => d),
};
