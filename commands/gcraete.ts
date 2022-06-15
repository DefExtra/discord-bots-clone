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
  name: "gcreate",
  description: "starts a giveaway (interactive)",

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
    let col = await channel?.createMessageCollector({
      filter: (args_0) => args_0.author.id == user.id,
      time: 1000 * 60 * 3,
    });
    let data: any[] = [];
    let i = 0;
    let res = await respond(
      {
        content: `🎉 Alright! Let's set up your giveaway! First, what channel do you want the giveaway in?\nYou can type cancel at any time to \`cancel\` creation.\n\n\`Please type the name of a channel in this server.\``,
      },
      message,
      channel
    );
    res;
    col?.on("collect", async (args_0) => {
      setTimeout(async () => {
        await col?.stop();
        await respond(
          {
            content: `💥 Uh oh! You took longer than 2 minutes to respond, <@!${user.id}>!\n\n\`Giveaway creation has been cancelled.\``,
          },
          message,
          channel
        );
      }, 1000 * 60 * 2 + 10);
      if (args_0.content == "cancel") {
        await col?.stop();
        await respond(
          {
            content: `💥 Alright, I guess we're not having a giveaway after all...\n\n\`Giveaway creation has been cancelled.\``,
          },
          message,
          channel
        );
      } else {
        switch (i) {
          case 0:
            {
              let arg = args_0.content;

              let c =
                (await guild?.channels.cache.get(arg)) ||
                (await guild?.channels.cache.find((c) => c.name == arg)) ||
                (await args_0.mentions.channels.first());
              if (!c || !c.isText()) {
                await respond(
                  {
                    content: `💥 Uh oh, I couldn't find any channels called '${arg}'! Try again!\n\n\`Please type the name of a channel in this server.\``,
                  },
                  message,
                  channel
                );
              } else {
                i = 1;
                data.push(c.id);
                await respond(
                  {
                    content: `🎉 Sweet! The giveaway will be in <#${c.id}>! Next, how long should the giveaway last?\n\n\`Please enter the duration of the giveaway in seconds.\nAlternatively, enter a duration in minutes and include an M at the end, or days and include a D.\``,
                  },
                  message,
                  channel
                );
              }
            }
            break;
          case 1:
            {
              let arg = ms(args_0.content);
              if (arg == undefined) {
                await respond(
                  {
                    content: `💥 Hm. I can't seem to get a number from that. Can you try again?\n\n\`Please enter the duration of the giveaway in seconds.\nAlternatively, enter a duration in minutes and include an M at the end, or days and include a D.\``,
                  },
                  message,
                  channel
                );
              } else {
                let timePP = () => {
                  if (args_0.content.includes("h"))
                    return `${args_0.content.split("h")} hours`;
                  else if (args_0.content.includes("m"))
                    return `${args_0.content.split("m")} minutes`;
                  else if (args_0.content.includes("d"))
                    return `${args_0.content.split("d")} days`;
                  else if (args_0.content.includes("s"))
                    return `${args_0.content.split("s")} seconds`;
                  else return args_0.content;
                };
                i = 2;
                data.push(arg);
                await respond(
                  {
                    content: `🎉 Neat! This giveaway will last ${timePP()}! Now, how many winners should there be?\n\n\`Please enter a number of winners between 1 and 20.\``,
                  },
                  message,
                  channel
                );
              }
            }
            break;
          case 2:
            {
              let arg = Number(args_0.content);
              if (isNaN(arg)) {
                await respond(
                  {
                    content: `💥 Uh... that doesn't look like a valid number.\n\n\`Please enter a number of winners between 1 and 20.\``,
                  },
                  message,
                  channel
                );
              } else if (arg > 20 || arg < 1) {
                await respond(
                  {
                    content: `💥 Hey! I can only support 1 to 20 winners!\n\n\`Please enter a number of winners between 1 and 20.\``,
                  },
                  message,
                  channel
                );
              } else {
                i = 3;
                data.push(arg);
                await respond(
                  {
                    content: `:tada: Ok! ${arg} winners it is! Finally, what do you want to give away?\n\n\`Please enter the giveaway prize. This will also begin the giveaway.\``,
                  },
                  message,
                  channel
                );
              }
            }
            break;
          case 3:
            {
              let arg = args_0.content;
              col?.stop();
              data.push(arg);
              let channel2 = guild?.channels.cache.get(data[0]);
              await respond(
                {
                  content: `🎉 Done! The giveaway for the \`${arg}\` is starting in <#${data[0]}>!`,
                },
                message,
                channel
              );

              createGiveaway(
                channel2,
                data[1],
                data[2],
                data[3],
                emoji,
                user,
                db
              );
            }
            break;
        }
      }
    });
  },
};
