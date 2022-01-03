import { Controller } from "../handler";
import { Router } from "express";
import { random } from "../videos-manager";

const videos: Controller = () => {
  const router = Router();

  router.get("/random", async (req, res) => {
    const randomVideo = await random();
    res.json({ video: randomVideo });
  });

  return {
    router,
    url: "/api/videos",
  };
};

export default videos;
