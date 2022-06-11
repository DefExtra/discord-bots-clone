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
    name: "نهب",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        var user = ((_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first()) ||
            ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(args[0]));
        if (!user)
            return message.reply({
                content: `منشن اللي تبي تزرفه!`,
            });
        if (user.id == message.author.id) return message.reply({
                content: `> اوكيه قلنا انك غبي بس تنهب نفسك! جديده هذي :joy:`,
            });
        if (Number(yield db.get(`credits_${user.user.id}`)) < 3000)
            return message.reply({
                content: `ماتقدر تنهب احد رصيده اقل من 3000$`,
            });
        let timeout = 900000 * 2;
        let daily = yield db.get(`nahb_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `بس ياسروق ياحرامي تعال بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
        }
        else {
            let bals = [
                2000, 3000, 500, 1923, 4234, 7893, 1512, 1231, 5673, 4321, 213, 43,
                6723,
            ];
            let bal = bals[Math.floor(Math.random() * bals.length)];
            if (Number(yield db.get(`credits_${user.user.id}`)) < bal)
                bal = 2532;
            yield db.set(`nahb_${message.author.id}`, Date.now());
            yield db.add(`credits_${message.author.id}`, Number(bal));
            yield db.sub(`credits_${user.user.id}`, Number(bal));
            message
                .reply({
                embeds: [
                    {
                        author: {
                            name: message.author.username,
                            iconURL: message.author.avatarURL({ dynamic: true }) || "",
                        },
                        description: `> ازبن يالذيب تم نهب ${bal} بنجاح 🏃🏻`,
                        timestamp: new Date(),
                        footer: {
                            iconURL: ((_c = message.guild) === null || _c === void 0 ? void 0 : _c.iconURL({ dynamic: true })) || "",
                            text: (_d = message.guild) === null || _d === void 0 ? void 0 : _d.name,
                        },
                    },
                ],
            })
                .then((m) => __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f, _g, _h, _j;
                if (!user)
                    return;
                (yield (user === null || user === void 0 ? void 0 : user.createDM())).send({
                    embeds: [
                        {
                            thumbnail: {
                                url: "https://media.discordapp.net/attachments/915767794245697536/938973487345831986/png-transparent-theft-robbery-crime-thief-hand-people-logo-removebg-preview.png",
                            },
                            author: {
                                name: user.user.username,
                                iconURL: user.user.avatarURL({ dynamic: true }) || "",
                            },
                            timestamp: new Date(),
                            footer: {
                                iconURL: ((_e = client.user) === null || _e === void 0 ? void 0 : _e.avatarURL({ dynamic: true })) || "",
                                text: (_f = client.user) === null || _f === void 0 ? void 0 : _f.username,
                            },
                            description: `االحق الحق حلالك!!\nذا <@!${message.author.id}> سرق منك **${bal}**\nلا تقول اني علمتك!! :wink:\n\nلعرض الدليل: [[اضغط هنا](${m.url})]`,
                        },
                    ],
                });
                (yield ((_g = message.author) === null || _g === void 0 ? void 0 : _g.createDM())).send({
                    embeds: [
                        {
                            thumbnail: {
                                url: "https://media.discordapp.net/attachments/915767794245697536/938973487345831986/png-transparent-theft-robbery-crime-thief-hand-people-logo-removebg-preview.png",
                            },
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL({ dynamic: true }) || "",
                            },
                            timestamp: new Date(),
                            footer: {
                                iconURL: ((_h = client.user) === null || _h === void 0 ? void 0 : _h.avatarURL({ dynamic: true })) || "",
                                text: (_j = client.user) === null || _j === void 0 ? void 0 : _j.username,
                            },
                            description: `كفو عليك يالحرامي 😉\nعملية نهب: <@!${user.user.id}> تمت بنجاح\nالمبلغ: ${bal}\nبس هااه انتبه احد يدري او تعلم احد!\nانا عن نفسي ما بعلم 🤔`,
                        },
                    ],
                });
            }));
        }
    }),
};
