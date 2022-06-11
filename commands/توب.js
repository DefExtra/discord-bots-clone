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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "توب",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        let allCreditsData = (yield db.all())
            .filter(({ id, value }) => id.startsWith("credits_"))
            .sort(function (a, b) {
            return a.value + b.value;
        });
        let msg = yield allCreditsData
            .map(function (value, index) {
            return `**#${index} | <@!${value.id.split("credits_").join("")}>** | **$${value.value}** 💰`;
        })
            .join("\n");
        yield message.reply({
            embeds: [
                {
                    color: "AQUA",
                    author: {
                        name: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.name,
                        iconURL: ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.iconURL({ dynamic: true })) || "",
                    },
                    title: "**قائمة اغنى اشخاص بالسيرفر:**",
                    description: msg,
                    footer: {
                        iconURL: ((_c = client.user) === null || _c === void 0 ? void 0 : _c.avatarURL({ dynamic: true })) || "",
                        text: (_d = client.user) === null || _d === void 0 ? void 0 : _d.username,
                    },
                },
            ],
        });
    }),
};
