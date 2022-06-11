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
    name: "طاولة",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let money = (yield db.get(`credits_${message.author.id}`)) || 0;
        let balance = args[0];
        if (!balance)
            return message.reply({
                content: `> الرجاء استخدام الأمر بالطريقة الصحيحة\n> ${__1.default.prefix}طاولة \`المبلغ\``,
            });
        if (Number(balance) < 200)
            return message.reply({
                content: `> اقل مبلغ للطاولة **200 $**`,
            });
        if (Number(balance) > Number(money))
            return message.reply({
                content: `> مبلغ الطاولة فوق ميزانيتك`,
            });
        let timeout = 900000;
        let daily = yield db.get(`tawla_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `تقدر تلعب طاولة بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
        }
        else {
            let cons = [true, false];
            let con = cons[Math.floor(Math.random() * cons.length)];
            if (con == true) {
                yield db.set(`tawla_${message.author.id}`, Date.now());
                yield db.add(`credits_${message.author.id}`, Number(balance));
                message.reply({
                    embeds: [
                        {
                            thumbnail: { url: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) || "" },
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL({ dynamic: true }) || "",
                            },
                            description: `كفو عليك طاولة رابحه :partying_face:\nالمبلغ: **${balance} $**\nرصيدك السابق: **${money} $**\nرصيدك الحالي: **${Number(money) + Number(balance)} $**`,
                        },
                    ],
                });
            }
            else {
                yield db.set(`tawla_${message.author.id}`, Date.now());
                yield db.sub(`credits_${message.author.id}`, Number(balance));
                message.reply({
                    embeds: [
                        {
                            thumbnail: { url: ((_b = client.user) === null || _b === void 0 ? void 0 : _b.avatarURL()) || "" },
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL({ dynamic: true }) || "",
                            },
                            description: `القققممم طاولة خاسرة :joy::broken_heart:\nالمبلغ: **${balance} $**\nرصيدك السابق: **${money} $**\nرصيدك الحالي: **${Number(money) - Number(balance)} $**`,
                        },
                    ],
                });
            }
        }
    }),
};
