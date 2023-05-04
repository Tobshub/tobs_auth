import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import { dbConn } from "./config/prisma";
import logger from "./config/logger";
import appRouter from "./app/router";

const app = express();

app.use(express.json(), cors());

app.use(appRouter);

dbConn().then((res) => {
  if (res.ok) {
    app.listen(4000, () => {
      logger.info("Live ::4000");
    });
  }
});
