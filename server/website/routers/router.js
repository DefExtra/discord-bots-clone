"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const __1 = __importDefault(require("../../.."));
const app = express_1.default.Router();
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/server/website/pages/index.html");
});
app.get("/donate", (req, res) => {
    res.redirect("https://discord.com/users/933856726770413578");
});
app.get("/invite", (req, res) => {
    var _a;
    res.redirect(`https://discord.com/oauth2/authorize?permissions=347200&scope=bot+applications.commands&client_id=${(_a = __1.default.user) === null || _a === void 0 ? void 0 : _a.id}`);
});
exports.default = app;
