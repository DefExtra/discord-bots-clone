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
    name: "راتب",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let timeout = 900000;
        let daily = yield db.get(`daily_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `ودي اعطيك بس مقدر الا بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
        }
        else {
            let bals = [
                1000, 2000, 1000, 1000, 3000, 1000, 2500, 1000, 500, 1000, 1000, 1000,
                10000, 200, 1000, 200, 1000,
            ];
            let bal = bals[Math.floor(Math.random() * bals.length)];
            let money = yield db.get(`credits_${message.author.id}`);
            if (!money || money == null)
                yield db.set(`credits_${message.author.id}`, bal);
            else
                yield db.add(`credits_${message.author.id}`, bal);
            db.set(`daily_${message.author.id}`, Date.now());
            message.reply({
                embeds: [
                    {
                        author: {
                            name: message.author.username,
                            iconURL: message.author.avatarURL({ dynamic: true }) || "",
                        },
                        thumbnail: { url: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) || "" },
                        description: `اشعار ايداع\nالمبلغ: **${bal} $**\nنوع العمليه: اضافة راتب\nرصيدك الحالي: **${yield db.get(`credits_${message.author.id}`)} $**`,
                        timestamp: new Date(),
                        footer: {
                            iconURL: ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.iconURL({ dynamic: true })) || "",
                            text: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.name,
                        },
                    },
                ],
            });
        }
    }),
};
