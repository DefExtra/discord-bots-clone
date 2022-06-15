import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  ReplyOptions,
} from "discord.js";
import DiscordClient from "../client/DiscordClient";
import { ms } from "../pkg/ms";
import parseMs from "parse-ms";
import { QuickDB } from "quick.db";

export default {
  name: "gend",
  description: "end a giveaway",
  options: [
    {
      name: "giveaway_id",
      description: "giveaway message id",
      type: 3,
      required: true,
    },
  ],

  run: async (
    client: DiscordClient,
    interaction: CommandInteraction,
    message: Message,
    isSlash: boolean,
    db: QuickDB
  ) => {
    const emoji =
      isSlash == true
        ? interaction.guild?.emojis.cache.find((e) => e.name == "gyaybot")
        : message.guild?.emojis.cache.find((e) => e.name == "gyaybot");
    const respond = (
      data: InteractionReplyOptions,
      message: any,
      channel: any
    ) =>
      isSlash == true
        ? interaction.reply(data).catch(() => channel?.send(data))
        : message.reply(data).catch(() => channel?.send(data));
    let channel = isSlash == true ? interaction.channel : message.channel;
    let guild = isSlash == true ? interaction.guild : message.guild;
    let user = isSlash == true ? interaction.user : message.author;
    // get args
    let id =
      isSlash == true
        ? interaction.options.getString("giveaway_id", true)
        : message.content.split(" ").slice(1).join(" ");
    if (!id)
      return respond(
        {
          content:
            "💥 I couldn't find any recent giveaways in this channel.\nplease type the giveaway message id after the command.",
        },
        message,
        channel
      );
    let data: any = await db.get(`do_${id}`);
    if (!data || data == null)
      return respond(
        {
          content:
            "💥 That is not a valid message ID! Try running without an ID to use the most recent giveaway in a channel.",
        },
        message,
        channel
      );
    if (data.users !== null)
      return respond(
        {
          content: "💥 I couldn't determine a winner for that giveaway.",
        },
        message,
        channel
      );

    await db.set(`do_${id}`, {
      date: new Date().getTime() - Number(data.time),
      channel: data.channel,
      winners: data.winners,
      time: data.time,
      users: data.users,
    });
  },
};
