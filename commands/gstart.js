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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = require("../pkg/ms");
const createGiveaway_1 = __importDefault(require("../components/createGiveaway"));
exports.default = {
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
    run: (client, interaction, message, isSlash, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const emoji = isSlash == true
            ? (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.emojis.cache.find((e) => e.name == "gyaybot")
            : (_b = message.guild) === null || _b === void 0 ? void 0 : _b.emojis.cache.find((e) => e.name == "gyaybot");
        const respond = (data, message, channel) => isSlash == true
            ? interaction.reply(data).catch(() => channel === null || channel === void 0 ? void 0 : channel.send(data))
            : message.reply(data).catch(() => channel === null || channel === void 0 ? void 0 : channel.send(data));
        let channel = isSlash == true ? interaction.channel : message.channel;
        let guild = isSlash == true ? interaction.guild : message.guild;
        let user = isSlash == true ? interaction.user : message.author;
        // get the args;
        let args = [];
        if (isSlash == true) {
            args.push(interaction.options.getString("duration", true));
            args.push(interaction.options.getString("winners") || "1");
            args.push(interaction.options.getString("prize") || "");
        }
        else {
            let [empty, time, winners] = message.content.split(" ");
            yield args.push(time || "null");
            yield args.push(winners || "1");
            let prize = message.content.split(" ").slice(3).join(" ");
            yield args.push(prize || "");
        }
        //checker
        if (!args[0] || args[0] == "null")
            return respond({
                content: `💥 Please include a length of time, and optionally a number of winners and a prize!\nExample usage: \`${client.config().bot.prefix}gstart 30m 5w Awesome T-Shirt\``,
            }, message, channel);
        let arg = (0, ms_1.ms)(args[0]);
        if (arg == undefined)
            return respond({
                content: `💥 Failed to parse time from \`${args[0]}\`\nExample usage: \`${client.config().bot.prefix}gstart 30m 5w Awesome T-Shirt\``,
            }, message, channel);
        yield (0, createGiveaway_1.default)(guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((channel === null || channel === void 0 ? void 0 : channel.id) || ""), ((_c = (0, ms_1.ms)(args[0])) === null || _c === void 0 ? void 0 : _c.toString()) || "", args[1].split("w").join(""), args[2], emoji, user, db);
    }),
};
