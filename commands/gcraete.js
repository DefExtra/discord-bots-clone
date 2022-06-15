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
    name: "gcreate",
    description: "starts a giveaway (interactive)",
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
        let col = yield (channel === null || channel === void 0 ? void 0 : channel.createMessageCollector({
            filter: (args_0) => args_0.author.id == user.id,
            time: 1000 * 60 * 3,
        }));
        let data = [];
        let i = 0;
        let res = yield respond({
            content: `🎉 Alright! Let's set up your giveaway! First, what channel do you want the giveaway in?\nYou can type cancel at any time to \`cancel\` creation.\n\n\`Please type the name of a channel in this server.\``,
        }, message, channel);
        res;
        col === null || col === void 0 ? void 0 : col.on("collect", (args_0) => __awaiter(void 0, void 0, void 0, function* () {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (col === null || col === void 0 ? void 0 : col.stop());
                yield respond({
                    content: `💥 Uh oh! You took longer than 2 minutes to respond, <@!${user.id}>!\n\n\`Giveaway creation has been cancelled.\``,
                }, message, channel);
            }), 1000 * 60 * 2 + 10);
            if (args_0.content == "cancel") {
                yield (col === null || col === void 0 ? void 0 : col.stop());
                yield respond({
                    content: `💥 Alright, I guess we're not having a giveaway after all...\n\n\`Giveaway creation has been cancelled.\``,
                }, message, channel);
            }
            else {
                switch (i) {
                    case 0:
                        {
                            let arg = args_0.content;
                            let c = (yield (guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(arg))) ||
                                (yield (guild === null || guild === void 0 ? void 0 : guild.channels.cache.find((c) => c.name == arg))) ||
                                (yield args_0.mentions.channels.first());
                            if (!c || !c.isText()) {
                                yield respond({
                                    content: `💥 Uh oh, I couldn't find any channels called '${arg}'! Try again!\n\n\`Please type the name of a channel in this server.\``,
                                }, message, channel);
                            }
                            else {
                                i = 1;
                                data.push(c.id);
                                yield respond({
                                    content: `🎉 Sweet! The giveaway will be in <#${c.id}>! Next, how long should the giveaway last?\n\n\`Please enter the duration of the giveaway in seconds.\nAlternatively, enter a duration in minutes and include an M at the end, or days and include a D.\``,
                                }, message, channel);
                            }
                        }
                        break;
                    case 1:
                        {
                            let arg = (0, ms_1.ms)(args_0.content);
                            if (arg == undefined) {
                                yield respond({
                                    content: `💥 Hm. I can't seem to get a number from that. Can you try again?\n\n\`Please enter the duration of the giveaway in seconds.\nAlternatively, enter a duration in minutes and include an M at the end, or days and include a D.\``,
                                }, message, channel);
                            }
                            else {
                                let timePP = () => {
                                    if (args_0.content.includes("h"))
                                        return `${args_0.content.split("h")} hours`;
                                    else if (args_0.content.includes("m"))
                                        return `${args_0.content.split("m")} minutes`;
                                    else if (args_0.content.includes("d"))
                                        return `${args_0.content.split("d")} days`;
                                    else if (args_0.content.includes("s"))
                                        return `${args_0.content.split("s")} seconds`;
                                    else
                                        return args_0.content;
                                };
                                i = 2;
                                data.push(arg);
                                yield respond({
                                    content: `🎉 Neat! This giveaway will last ${timePP()}! Now, how many winners should there be?\n\n\`Please enter a number of winners between 1 and 20.\``,
                                }, message, channel);
                            }
                        }
                        break;
                    case 2:
                        {
                            let arg = Number(args_0.content);
                            if (isNaN(arg)) {
                                yield respond({
                                    content: `💥 Uh... that doesn't look like a valid number.\n\n\`Please enter a number of winners between 1 and 20.\``,
                                }, message, channel);
                            }
                            else if (arg > 20 || arg < 1) {
                                yield respond({
                                    content: `💥 Hey! I can only support 1 to 20 winners!\n\n\`Please enter a number of winners between 1 and 20.\``,
                                }, message, channel);
                            }
                            else {
                                i = 3;
                                data.push(arg);
                                yield respond({
                                    content: `:tada: Ok! ${arg} winners it is! Finally, what do you want to give away?\n\n\`Please enter the giveaway prize. This will also begin the giveaway.\``,
                                }, message, channel);
                            }
                        }
                        break;
                    case 3:
                        {
                            let arg = args_0.content;
                            col === null || col === void 0 ? void 0 : col.stop();
                            data.push(arg);
                            let channel2 = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(data[0]);
                            yield respond({
                                content: `🎉 Done! The giveaway for the \`${arg}\` is starting in <#${data[0]}>!`,
                            }, message, channel);
                            (0, createGiveaway_1.default)(channel2, data[1], data[2], data[3], emoji, user, db);
                        }
                        break;
                }
            }
        }));
    }),
};
