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
        if (data.users !== null)
            return respond({
                content: "💥 I couldn't determine a winner for that giveaway.",
            }, message, channel);
        yield db.set(`do_${id}`, {
            date: new Date().getTime() - Number(data.time),
            channel: data.channel,
            winners: data.winners,
            time: data.time,
            users: data.users,
        });
    }),
};
