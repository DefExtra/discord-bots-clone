"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "greroll",
    description: "reroll a giveaway",
    options: [
        {
            name: "giveaway_id",
            description: "giveaway message id",
            type: 3,
            required: true,
        },
    ],
    run: (client, interaction, message, isSlash, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const emoji = isSlash == true
            ? (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.emojis.cache.find((e) => e.name == "gyaybot")
            : (_b = message.guild) === null || _b === void 0 ? void 0 : _b.emojis.cache.find((e) => e.name == "gyaybot");
        const respond = (data, message, channel) => isSlash == true
            ? interaction.reply(data).catch(() => channel === null || channel === void 0 ? void 0 : channel.send(data))
            : message.reply(data).catch(() => channel === null || channel === void 0 ? void 0 : channel.send(data));
        let channel = isSlash == true ? interaction.channel : message.channel;
        let guild = isSlash == true ? interaction.guild : message.guild;
        let user = isSlash == true ? interaction.user : message.author;
        // get args
        let id = isSlash == true
            ? interaction.options.getString("giveaway_id", true)
            : message.content.split(" ").slice(1).join(" ");
        if (!id)
            return respond({
                content: "💥 I couldn't find any recent giveaways in this channel.\nplease type the giveaway message id after the command.",
            }, message, channel);
        let data = yield db.get(`do_${id}`);
        if (!data || data == null)
            return respond({
                content: "💥 That is not a valid message ID! Try running without an ID to use the most recent giveaway in a channel.",
            }, message, channel);
        if (data.users == null)
            return respond({
                content: "💥 I couldn't determine a winner for that giveaway.",
            }, message, channel);
        let usersData = yield db.get(`do_${id}`);
        let winnersArray = [];
        for (let index = 0; index < Number(usersData.winners); index++) {
            const element = usersData.users[Math.floor(Math.random() * usersData.users.length)];
            if (!winnersArray.includes(element))
                winnersArray.push(element);
        }
        yield setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield winnersArray.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                yield (channel === null || channel === void 0 ? void 0 : channel.send({
                    content: `Congratulations <@!${element}>! You won!`,
                    embeds: [
                        {
                            color: 0x36393f,
                            description: `**${channel.messages.cache.get(id)
                                ? Number((_d = (_c = channel.messages.cache.get(id)) === null || _c === void 0 ? void 0 : _c.reactions.cache.first()) === null || _d === void 0 ? void 0 : _d.users.cache.size) - 1
                                : 0}** entrants ↗`,
                        },
                    ],
                }));
            }));
        }), 324);
    }),
};
