import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import npmlog from "npmlog";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import handler from "./handler";
import bot from "./bot";

function main() {
  dotenv.config();

  const staticPath = path.join(__dirname, "..", "static");
  const videosPart = path.join(__dirname, "..", "videos");
  const imagesPart = path.join(__dirname, "..", "images");
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use("/videos", express.static(videosPart));
  app.use("/images", express.static(imagesPart));
  app.use("/", express.static(staticPath));
  app.use(express.json());

  const db = new PrismaClient();
  handler(app, db);

  const port = process.env.SERVER_PORT || 3000;
  app.listen(port, () => {
    npmlog.log("info", "index", `Server listening on port ${port}`);

    bot(db);
  });
}

main();
