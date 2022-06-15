import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  ReplyOptions,
} from "discord.js";
import DiscordClient from "../client/DiscordClient";
import { ms } from "../pkg/ms";
import parseMs from "parse-ms";
import createGiveaway from "../components/createGiveaway";
import { QuickDB } from "quick.db";

export default {
  name: "gstart",
  description: "starts a giveaway",
  options: [
    {
      name: "duration",
      description: "duration of the giveaway",
      type: 3,
      required: true,
    },
    {
      name: "winners",
      description: "number of winners",
      type: 3,
      required: false,
    },
    {
      name: "prize",
      description: "the prize being given away",
      type: 3,
      required: false,
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
    // get the args;
    let args: string[] = [];
    if (isSlash == true) {
      args.push(interaction.options.getString("duration", true));
      args.push(interaction.options.getString("winners") || "1");
      args.push(interaction.options.getString("prize") || "");
    } else {
      let [empty, time, winners] = message.content.split(" ");
      await args.push(time || "null");
      await args.push(winners || "1");
      let prize = message.content.split(" ").slice(3).join(" ");
      await args.push(prize || "");
    }
    //checker
    if (!args[0] || args[0] == "null")
      return respond(
        {
          content: `💥 Please include a length of time, and optionally a number of winners and a prize!\nExample usage: \`${
          client.config().bot.prefix
        }gstart 30m 5w Awesome T-Shirt\``,
        },
        message,
        channel
      );
    let arg = ms(args[0]);
    if (arg == undefined)
      return respond(
        {
          content: `💥 Failed to parse time from \`${args[0]}\`\nExample usage: \`${
          client.config().bot.prefix
        }gstart 30m 5w Awesome T-Shirt\``,
        },
        message,
        channel
      );
    await createGiveaway(
      guild?.channels.cache.get(channel?.id || ""),
      ms(args[0])?.toString() || "",
      args[1].split("w").join(""),
      args[2],
      emoji,
      user,
      db
    );
  },
};
