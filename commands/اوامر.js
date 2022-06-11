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
    name: "اوامر",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        message.reply({
            embeds: [
                {
                    color: "WHITE",
                    title: "الأوامر ألخاصة بالبوت",
                    description: `${__1.default.prefix}راتب\n${__1.default.prefix}طاولة\n${__1.default.prefix}استثمار\n${__1.default.prefix}تداول\n${__1.default.prefix}رهان\n${__1.default.prefix}نرد\n${__1.default.prefix}يخشيش\n${__1.default.prefix}تحويل\n${__1.default.prefix}لعبه\n${__1.default.prefix}نهب\n${__1.default.prefix}توب\n${__1.default.prefix}فلوس\nfor more help contact <@670415678716772382>\n\n> \` - \` **تم نسخ البوت عن طريق: Def.**`,
                    footer: {
                        iconURL: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL({ dynamic: true })) || "",
                        text: ((_b = client.user) === null || _b === void 0 ? void 0 : _b.username) || "",
                    },
                },
            ],
        });
    }),
};
