import { Controller } from "../handler";
import { Router } from "express";

const s: Controller = (db) => {
  const router = Router();

  router.get("/:short", async (req, res) => {
    const { short } = req.params;
    const link = await db.links.findUnique({
      where: {
        id: short,
      },
      select: {
        url: true,
      },
    });

    if (!link) return res.status(404).send("Not found");
    res.redirect(link.url);
  });

  return {
    router,
    url: "/s",
  };
};

export default s;
