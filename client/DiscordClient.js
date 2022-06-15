"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
const config = JSON.parse(node_fs_1.default.readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" }));
class DiscordClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
    }
    config() {
        return config;
    }
}
exports.default = DiscordClient;
