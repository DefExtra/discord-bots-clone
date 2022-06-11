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
const parse_ms_1 = __importDefault(require("parse-ms"));
exports.default = {
    name: "لعبه",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        let timeout = 300000;
        let daily = yield db.get(`la3ba_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `يمكنك اللعب بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
        }
        else {
            message
                .reply({
                embeds: [
                    {
                        color: "AQUA",
                        title: "**حجرة, ورقة, مقص**",
                        description: `عند الفوز ستحصل على **1000$**\nعند الخساره او التعادل لن يخصم منك شي`,
                    },
                ],
            })
                .then((m) => __awaiter(void 0, void 0, void 0, function* () {
                yield m.react("🧱");
                yield m.react("✂️");
                yield m.react("📰");
                yield m
                    .createReactionCollector({
                    time: 1000 * 60 * 60 * 24,
                    max: 1,
                    filter: (zero, one) => one.id == message.author.id,
                })["on"]("collect", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
                    let reactions = ["🧱", "✂️", "📰"];
                    let botChoose = reactions[Math.floor(Math.random() * reactions.length)];
                    // statmints
                    if (reaction.emoji.name == "📰" && botChoose == "🧱")
                        human_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else if (reaction.emoji.name == "🧱" && botChoose == "📰")
                        bot_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else if (reaction.emoji.name == "🧱" && botChoose == "✂️")
                        human_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else if (reaction.emoji.name == "✂️" && botChoose == "🧱")
                        bot_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else if (reaction.emoji.name == "✂️" && botChoose == "📰")
                        human_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else if (reaction.emoji.name == "📰" && botChoose == "✂️")
                        bot_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                    else
                        bot_is_the_winner(m, db, [reaction.emoji.name, botChoose], message.author);
                }));
            }));
        }
    }),
};
function human_is_the_winner(message, db, chooses, author) {
    return __awaiter(this, void 0, void 0, function* () {
        message.edit({
            embeds: [
                {
                    color: "AQUA",
                    title: "**حجرة, ورقة, مقص**",
                    description: `✅ لقد فزت وكسبت **1000$**\n\nانت اخترت ${chooses[0]},وانا اخترت ${chooses[1]}!`,
                },
            ],
        });
        yield db.add(`credits_${author.id}`, 1000);
    });
}
function bot_is_the_winner(message, db, chooses, author) {
    return __awaiter(this, void 0, void 0, function* () {
        message.edit({
            embeds: [
                {
                    color: "AQUA",
                    title: "**حجرة, ورقة, مقص**",
                    description: `❌ لقد خسرت راحت عليك الـ **1000$**\n\nانت اخترت ${chooses[0]},وانا اخترت ${chooses[1]}!`,
                },
            ],
        });
    });
}
