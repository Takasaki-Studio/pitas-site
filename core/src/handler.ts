import glob from "glob";
import { Express, Router } from "express";
import log from "npmlog";
import { PrismaClient } from "@prisma/client";

export interface ControllerReturn {
  url: string;
  router: Router;
}

export type Controller = (db: PrismaClient) => ControllerReturn;

function handleControllers(app: Express, db: PrismaClient) {
  glob(`${__dirname}/routes/**/*.{js,ts}`, {}, async (err, files) => {
    if (err) return log.error("handler", "Error loading routes %s", err);

    const routes = files.map(async (file) => {
      const route = (await import(file)).default as Controller;
      if (typeof route !== "function")
        return log.error("handler", "Invalid route %s", file);

      const routeData = route(db);
      log.info("handler", "Registering controller %s", routeData.url);
      app.use(routeData.url, routeData.router);
    });

    await Promise.all(routes);

    app.all("*", (req, res) => {
      res.status(404).send("Not found");
    });
    log.info("handler", "Controllers loaded");
  });
}

export default handleControllers;
