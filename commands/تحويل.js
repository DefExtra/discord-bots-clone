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
exports.default = {
    name: "تحويل",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        let [userId, balance] = args;
        let user = ((_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first()) ||
            ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userId));
        if (!user || !balance)
            return message.reply({
                content: `> الرجاء كتابة الأمر بالطريقه التالية\n\`${__1.default.prefix}تحويل @قمقم#3000 500\``,
            });
        if (Number(balance) < 500)
            return message.reply({
                content: `> لا يمكنك تحويل اقل من 500$`,
            });
        if (Number(yield db.get(`credits_${message.author.id}`)) < Number(balance))
            return message.reply({
                content: "> رصيدك البنكي اقل من المبلغ المراد تحويله",
            });
        var num = parseFloat(balance);
        var bal = num - num * 0.1;
        yield db.sub(`credits_${message.author.id}`, Number(balance));
        yield db.add(`credits_${user.id}`, bal);
        message.reply({
            embeds: [
                {
                    author: {
                        iconURL: message.author.avatarURL({ dynamic: true }) || "",
                        name: message.author.tag,
                    },
                    thumbnail: { url: ((_c = client.user) === null || _c === void 0 ? void 0 : _c.avatarURL({ dynamic: true })) || "" },
                    timestamp: new Date(),
                    footer: {
                        iconURL: ((_d = message.guild) === null || _d === void 0 ? void 0 : _d.iconURL({ dynamic: true })) || "",
                        text: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.name,
                    },
                    description: `حوالة صادرة\n\nمن: <@!${message.author.id}>\nحساب رقم: \`${message.author.id}\`\nالى: <@!${user.id}>\nحساب رقم: \`${user.id}\`\nتم خصم 10% ضريبة البنك\nالمبلغ: **${bal}$**`,
                },
            ],
        });
    }),
};
