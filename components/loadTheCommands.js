"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_fs_1 = __importDefault(require("node:fs"));
const quick_db_1 = require("quick.db");
const db = new quick_db_1.QuickDB({ filePath: process.cwd() + "/def.database.sqlite" });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const commandDir = node_fs_1.default.readdirSync(process.cwd() + "/commands/");
const commands = new Map();
exports.default = (client, guildId, config) => __awaiter(void 0, void 0, void 0, function* () {
    client
        .on("messageCreate", (m) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let g = client.guilds.cache.get(guildId);
        let emoji = g === null || g === void 0 ? void 0 : g.emojis.cache.find((e) => e.name == "gyaybot");
        if (!emoji)
            g === null || g === void 0 ? void 0 : g.emojis.create("https://cdn.discordapp.com/emojis/585696613507399692.webp?size=128&quality=lossless", "gyaybot");
        if (m.author.bot)
            return;
        if (m.channel.type == "DM")
            return;
        if (!m.content.startsWith(config.bot.prefix))
            return;
        let [cmd, ...args] = m.content.split(" ");
        let cmdName = cmd.split(config.bot.prefix).join("");
        if (((_a = m.member) === null || _a === void 0 ? void 0 : _a.permissions.has("MANAGE_GUILD")) ||
            ((_b = m.member) === null || _b === void 0 ? void 0 : _b.roles.cache.find((r) => r.name == "Giveaways"))) {
            yield ((_c = commands.get(cmdName)) === null || _c === void 0 ? void 0 : _c.run(client, null, m, false, db));
        }
        else
            m.reply('💥 You must have the Manage Server permission, or a role called "Giveaways", to use this command!');
    }))
        .on("interactionCreate", (m) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g, _h, _j;
        let g = client.guilds.cache.get(guildId);
        let emoji = g === null || g === void 0 ? void 0 : g.emojis.cache.find((e) => e.name == "gyaybot");
        if (!emoji)
            g === null || g === void 0 ? void 0 : g.emojis.create("https://cdn.discordapp.com/emojis/585696613507399692.webp?size=128&quality=lossless", "gyaybot");
        if (m.user.bot)
            return;
        if (!m.isCommand())
            return;
        if (((_d = m.channel) === null || _d === void 0 ? void 0 : _d.type) == "DM")
            return;
        if (((_f = (_e = m.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(m.user.id)) === null || _f === void 0 ? void 0 : _f.permissions.has("MANAGE_GUILD")) ||
            ((_h = (_g = m.guild) === null || _g === void 0 ? void 0 : _g.members.cache.get(m.user.id)) === null || _h === void 0 ? void 0 : _h.roles.cache.find((r) => r.name == "Giveaways"))) {
            yield ((_j = commands.get(m.commandName)) === null || _j === void 0 ? void 0 : _j.run(client, m, null, true, db));
        }
        else {
            m.reply('💥 You must have the Manage Server permission, or a role called "Giveaways", to use this command!');
        }
    }));
    yield getCommands();
    yield registerCommands(client, guildId);
    return commands;
});
const registerCommands = (client, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    let commandsArray = [];
    yield commands.forEach((t) => {
        if (t === null || t === void 0 ? void 0 : t.options) {
            commandsArray.push({
                name: t.name,
                description: t.description,
                type: 1,
                options: t.options,
            });
        }
        else {
            commandsArray.push({
                name: t.name,
                description: t.description,
                type: 1,
            });
        }
    });
    const rest = new rest_1.REST({ version: "9" }).setToken(client.token || "");
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _k;
        try {
            console.log("Started refreshing application (/) commands.");
            yield rest.put(v9_1.Routes.applicationGuildCommands(((_k = client.user) === null || _k === void 0 ? void 0 : _k.id) || "", guildId), {
                body: commandsArray,
            });
            console.log("Successfully reloaded application (/) commands.");
        }
        catch (error) {
            console.error(error);
        }
    }))();
});
const getCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    yield commandDir.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        let commandFile = yield Promise.resolve().then(() => __importStar(require(process.cwd() + "/commands/" + file)));
        commands.set(commandFile.default.name, commandFile.default);
    }));
});
