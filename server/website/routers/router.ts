import express, { Router } from "express";
import client from "../../..";
const app: Router = express.Router();

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/server/website/pages/index.html");
});

app.get("/donate", (req, res) => {
  res.redirect("https://discord.com/users/933856726770413578");
});

app.get("/invite", (req, res) => {
  res.redirect(
    `https://discord.com/oauth2/authorize?permissions=347200&scope=bot+applications.commands&client_id=${client.user?.id}`
  );
});

export default app;
