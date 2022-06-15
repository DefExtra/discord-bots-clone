import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  ReplyOptions,
} from "discord.js";
import DiscordClient from "../client/DiscordClient";

export default {
  name: "gabout",
  description: "show information about the bot",

  run: (
    client: DiscordClient,
    interaction: CommandInteraction,
    message: Message,
    isSlash: boolean
  ) => {
    const emoji =
      isSlash == true
        ? interaction.guild?.emojis.cache.find((e) => e.name == "gyaybot")
        : message.guild?.emojis.cache.find((e) => e.name == "gyaybot");
    const respond = (data: InteractionReplyOptions, message: any) =>
      isSlash == true ? interaction.reply(data) : message.reply(data);
    respond(
      {
        content: `${emoji} All about **GiveawayBot** ${emoji}`,
        embeds: [
          {
            color: 0x7289da,
            title: "**Hold giveaways quickly and easily!**",
            description: `Hello! I'm **GiveawayBot**, and I'm here to make it as easy as possible to hold giveaways on your Discord server! I was created by [**jagrosh**#4824](https://jagrosh.com/) (<@113156185389092864>) and cloned by [**Def.**#0001](http://discord.com/users/933856726770413578) using the [JDA](https://jda.com) library (4.2.1_41c8f3e) and [JDA-Utilities](https://jda.com) (3.0.5). Check out my commands by typing \`!ghelp\`, and checkout my website at ${
              client.config().server.host
            }.`,
            fields: [
              {
                name: "**📊 Stats**",
                value: "1941415 servers\n960 shards",
                inline: true,
              },
              {
                name: "**🎉 Giveaways**",
                value: "27028 right now!",
                inline: true,
              },
              {
                name: "**🌐 Links**",
                value: `[Website](${
                  client.config().server.host
                })\n[Invite](http://discord.com/users/933856726770413578)\n[Support](http://discord.com/users/933856726770413578)`,
                inline: true,
              },
            ],
            footer: { text: "Last restart•06/11/2022" },
          },
        ],
      },
      message
    );
  },
};
