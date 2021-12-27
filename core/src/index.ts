import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import npmlog from "npmlog";
import { PrismaClient } from "@prisma/client";

import handler from "./handler";

function main() {
  dotenv.config();

  const staticPath = path.join(__dirname, "..", "static");
  const app = express();
  app.use(helmet());
  app.use(express.static(staticPath));
  app.use(express.json());

  const db = new PrismaClient();
  handler(app, db);

  const port = process.env.SERVER_PORT || 3000;
  app.listen(port, () => {
    npmlog.log("info", "index", `Server listening on port ${port}`);
  });
}

main();
