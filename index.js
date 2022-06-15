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
const node_fs_1 = __importDefault(require("node:fs"));
const server_1 = require("./server");
const config = JSON.parse(node_fs_1.default.readFileSync("config.def", { encoding: "utf-8" }));
const DiscordClient_1 = __importDefault(require("./client/DiscordClient"));
const loadTheCommands_1 = __importDefault(require("./components/loadTheCommands"));
const client = new DiscordClient_1.default({
    intents: 32767,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, server_1.createServer)(config);
    yield client.login(config.bot.token);
    yield (0, loadTheCommands_1.default)(client, config.bot.guildId, config);
}))();
exports.default = client;
