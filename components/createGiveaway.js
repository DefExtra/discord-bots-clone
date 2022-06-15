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
const moment_1 = __importDefault(require("moment"));
function default_1(channel, time, winners, prize, emoji, user, db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
            let msg = yield channel.send({
                content: `**${emoji} GIVEAWAY ${emoji}**`,
                embeds: [
                    {
                        color: 0x7289da,
                        title: `**${prize}**`,
                        description: `React with ${emoji} to enter!\nEnds: <t:${(0, moment_1.default)(new Date().getTime() + Number(time)).unix()}:R> (<t:${(0, moment_1.default)(new Date().getTime() + Number(time)).unix()}:F>)\nHosted by: <@!${user.id}>`,
                        timestamp: (0, moment_1.default)(new Date().getTime() + Number(time)).unix(),
                        footer: { text: `${winners} winners | Ends at` },
                    },
                ],
            });
            yield msg.react(`<${(emoji === null || emoji === void 0 ? void 0 : emoji.animated) == true ? "a" : ""}:${emoji === null || emoji === void 0 ? void 0 : emoji.name}:${emoji === null || emoji === void 0 ? void 0 : emoji.id}>`);
            yield db.set(`do_${msg.id}`, {
                date: new Date().getTime(),
                channel: channel.id,
                winners: winners,
                time: time,
                users: null,
            });
            var interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let data = yield db.get(`do_${msg.id}`);
                if (data == null || !data)
                    return;
                let timeNow = new Date().getTime();
                if (timeNow > Number((data === null || data === void 0 ? void 0 : data.date) + Number(time))) {
                    if ((yield db.get(`end_${msg.id}`)) == true)
                        return;
                    yield db.set(`do_${msg.id}`, {
                        date: data.date,
                        channel: data.channel,
                        winners: data.winners,
                        time: data.time,
                        users: (_a = msg.reactions.cache
                            .first()) === null || _a === void 0 ? void 0 : _a.users.cache.filter((user) => user.bot == false).map((user) => user.id),
                    });
                    let usersData = yield db.get(`do_${msg.id}`);
                    let winnersArray = [];
                    for (let index = 0; index < Number(winners); index++) {
                        const element = usersData.users[Math.floor(Math.random() * usersData.users.length)];
                        if (!winnersArray.includes(element))
                            winnersArray.push(element);
                    }
                    yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.edit({
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
                        yield winnersArray.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            yield channel.send({
                                content: `Congratulations <@!${element}>! You won the **${prize}**!`,
                                embeds: [
                                    {
                                        color: 0x36393f,
                                        description: `**${Number((_b = msg.reactions.cache.first()) === null || _b === void 0 ? void 0 : _b.users.cache.size) - 1}** entrants ↗`,
                                    },
                                ],
                            });
                        }));
                        yield db.set(`end_${msg.id}`, true);
                    }), 324);
                }
            }), 1000);
            interval;
            yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield clearInterval(interval);
            }), Number(time) + 1000);
        }
    });
}
exports.default = default_1;
