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
    name: "بخشيش",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let timeout = 900000;
        let daily = yield db.get(`bakshesh_${message.author.id}`);
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = (0, parse_ms_1.default)(timeout - (Date.now() - daily));
            message.reply({
                content: `يا فقير تعال بعد:\n> **${time.minutes} minutes, ${time.seconds} seconds** :hourglass:`,
            });
            // (await db.get(`credits_${message.author.id}`))
        }
        else {
            let bals = [
                1000, 1000, 1000, 1000, 1000, 1000, 1000000, 300, 200, 1000, 3000, 100,
                50, 10, 1, 30, 1500, 1000, 1000, 1000, 1000,
            ];
            let bal = bals[Math.floor(Math.random() * bals.length)];
            yield db.set(`bakshesh_${message.author.id}`, Date.now());
            yield db.add(`credits_${message.author.id}`, Number(bal));
            message.reply({
                embeds: [
                    {
                        thumbnail: { url: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) || "" },
                        author: {
                            name: message.author.username,
                            iconURL: message.author.avatarURL({ dynamic: true }) || "",
                        },
                        description: `ما نقص مال من صدقه\nامسك **${bal}** يا فقير\nرصيدك الحالي: **${Number(yield db.get(`credits_${message.author.id}`))} $**`,
                    },
                ],
            });
        }
    }),
};
