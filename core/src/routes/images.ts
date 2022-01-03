import { Controller } from "../handler";
import { Router } from "express";
import { random } from "../images-manager";

const images: Controller = () => {
  const router = Router();

  router.get("/random", async (req, res) => {
    const randomimage = await random();
    res.json({ image: randomimage });
  });

  return {
    router,
    url: "/api/images",
  };
};

export default images;
