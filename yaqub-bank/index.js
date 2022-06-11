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
// import pkgs
const quick_db_1 = require("quick.db");
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
// load the config file
const config = JSON.parse(node_fs_1.default.readFileSync(__dirname+"/config.def", { encoding: "utf-8" }));
// connecting the database
const db = new quick_db_1.QuickDB({ filePath: "def.database.sqlite" });
// create a new discord.js client
const commands = new Map();
const client = new discord_js_1.Client({
    allowedMentions: {
        repliedUser: false,
    },
    intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_SCHEDULED_EVENTS",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ],
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER",
    ],
});
// login into the client
client["login"](config.token);
// load commands
node_fs_1.default.readdirSync(__dirname + "/commands/").map((file) => __awaiter(void 0, void 0, void 0, function* () {
    let cmd = yield Promise.resolve().then(() => __importStar(require(__dirname + "/commands/" + file)));
    if (cmd)
        commands.set(cmd.default.name, cmd.default);
}));
// logs
client["on"]("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    yield console.log("the bot is ready, mad by def.")
}))
// run commands
client["on"]("messageCreate", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.bot)
        return;
    if (msg.channel.type !== "GUILD_TEXT")
        return;
    let [cmd, ...args] = msg.content.split(" ");
    let cmdName = cmd.split(config.prefix).join("");
    try {
        let command = yield commands.get(cmdName);
        if (command)
            command === null || command === void 0 ? void 0 : command.run(client, msg, args, db);
    }
    catch (err) {
        console.log(err);
    }
}));
// export the config file
exports.default = config;
