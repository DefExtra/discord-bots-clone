import { GuildBasedChannel, GuildEmoji, User } from "discord.js";
import moment from "moment";
import { QuickDB } from "quick.db";

export default async function (
  channel: GuildBasedChannel | undefined,
  time: string,
  winners: string,
  prize: string,
  emoji: GuildEmoji | undefined,
  user: User,
  db: QuickDB
) {
  if (channel?.isText()) {
    let msg = await channel.send({
      content: `**${emoji} GIVEAWAY ${emoji}**`,
      embeds: [
        {
          color: 0x7289da,
          title: `**${prize}**`,
          description: `React with ${emoji} to enter!\nEnds: <t:${moment(
            new Date().getTime() + Number(time)
          ).unix()}:R> (<t:${moment(
            new Date().getTime() + Number(time)
          ).unix()}:F>)\nHosted by: <@!${user.id}>`,
          timestamp: moment(new Date().getTime() + Number(time)).unix(),
          footer: { text: `${winners} winners | Ends at` },
        },
      ],
    });
    await msg.react(
      `<${emoji?.animated == true ? "a" : ""}:${emoji?.name}:${emoji?.id}>`
    );
    await db.set(`do_${msg.id}`, {
      date: new Date().getTime(),
      channel: channel.id,
      winners: winners,
      time: time,
      users: null,
    });
    var interval = setInterval(async () => {
      let data: any = await db.get(`do_${msg.id}`);
      if (data == null || !data) return;
      let timeNow = new Date().getTime();
      if (timeNow > Number(data?.date + Number(time))) {
        if ((await db.get(`end_${msg.id}`)) == true) return;
        await db.set(`do_${msg.id}`, {
          date: data.date,
          channel: data.channel,
          winners: data.winners,
          time: data.time,
          users: msg.reactions.cache
            .first()
            ?.users.cache.filter((user) => user.bot == false)
            .map((user) => user.id),
        });
        let usersData: any = await db.get(`do_${msg.id}`);
        let winnersArray: string[] = [];
        for (let index = 0; index < Number(winners); index++) {
          const element =
            usersData.users[Math.floor(Math.random() * usersData.users.length)];
          if (!winnersArray.includes(element)) winnersArray.push(element);
        }
        await setTimeout(async () => {
          await msg.edit({
            content: msg.content,
            embeds: [
              {
                color: 0x36393f,
                title: msg.embeds[0].title || "",
                description: `Winner(s): ${winnersArray
                  .map((element) => `<@!${element}>`)
                  .join("\n")}\nHosted by: <@!${user.id}>`,
                footer: { text: "Ended at" },
                timestamp: new Date(),
              },
            ],
          });
          await winnersArray.forEach(async (element) => {
            await channel.send({
              content: `Congratulations <@!${element}>! You won the **${prize}**!`,
              embeds: [
                {
                  color: 0x36393f,
                  description: `**${
                    Number(msg.reactions.cache.first()?.users.cache.size) - 1
                  }** entrants ↗`,
                },
              ],
            });
          });
          await db.set(`end_${msg.id}`, true);
        }, 324);
      }
    }, 1000);
    interval;
    await setTimeout(async () => {
      await clearInterval(interval);
    }, Number(time) + 1000);
  }
}
