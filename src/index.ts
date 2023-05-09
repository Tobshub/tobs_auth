import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import { dbConn } from "./config/prisma";
import logger from "./config/logger";
import appRouter from "./app/router";
import path from "path";

const app = express();

app.use(
  express.json(),
  cors(),
  express.static(path.join(process.cwd(), "public"), { dotfiles: "deny" })
);

app.use("/api", appRouter);

app.use("/", (_, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

dbConn().then((res) => {
  if (res.ok) {
    app.listen(4000, () => {
      logger.info("Live ::4000");
    });
  }
});
