import express from "express";
import router from "./website/routers/router";

export async function createServer(config: any) {
  const app = express();

  app.listen(config.server.port, () =>
    console.log("server is on: " + config.server.host)
  );

  app.use("/", router);
}
