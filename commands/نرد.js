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
const __1 = __importDefault(require(".."));
const parse_ms_1 = __importDefault(require("parse-ms"));
exports.default = {
    name: "نرد",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        let money = (yield db.get(`credits_${message.author.id}`)) || 0;
        let balance = args[0];
        if (!balance)
            return message.reply({
                content: `> الرجاء استخدام الأمر بالطريقة الصحيحة\n> ${__1.default.prefix}نرد \`المبلغ\``,
            });
        if (Number(balance) < 500)
            return message.reply({
                content: `> اقل مبلغ للنرد هو 500`,
            });
        if (Number(balance) > Number(money))
            return message.reply({
                content: `> المبلغ فوق ميزانيت`,
            });
        let timeout = 900000;
        let daily = yield db.get(`nard_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `توك لاعب تعال بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
        }
        else {
            let yourNum = Math.floor(Math.random() * 100) + 1;
            let myNum = Math.floor(Math.random() * 100) + 1;
            if (yourNum > myNum) {
                yield db.set(`nard_${message.author.id}`, Date.now());
                yield db.add(`credits_${message.author.id}`, Number(balance));
                message.reply({
                    embeds: [
                        {
                            thumbnail: { url: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) || "" },
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL({ dynamic: true }) || "",
                            },
                            description: `فزت علي ياورع 😔\nانا اخترت: **${myNum}**\nوانت اخترت: **${yourNum}**\nالمبلغ اللي كسبته: **${balance}$**\nرصيد الحالي: **${Number(money) + Number(balance)}$**`,
                            timestamp: new Date(),
                            footer: {
                                iconURL: ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.iconURL({ dynamic: true })) || "",
                                text: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.name,
                            },
                        },
                    ],
                });
            }
            else {
                yield db.set(`nard_${message.author.id}`, Date.now());
                yield db.sub(`credits_${message.author.id}`, Number(balance));
                message.reply({
                    embeds: [
                        {
                            thumbnail: { url: ((_d = client.user) === null || _d === void 0 ? void 0 : _d.avatarURL()) || "" },
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL({ dynamic: true }) || "",
                            },
                            description: `انننننن القم فزت عليك 😛\nانا اخترت: **${myNum}**\nوانت اخترت: **${yourNum}**\nمبلغ الخسارة: **${balance}$**\nرصيدك الحالي: **${Number(money) - Number(balance)}$**`,
                            timestamp: new Date(),
                            footer: {
                                iconURL: ((_e = message.guild) === null || _e === void 0 ? void 0 : _e.iconURL({ dynamic: true })) || "",
                                text: (_f = message.guild) === null || _f === void 0 ? void 0 : _f.name,
                            },
                        },
                    ],
                });
            }
        }
    }),
};
