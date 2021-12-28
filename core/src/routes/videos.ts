import { Controller } from "../handler";
import { Router } from "express";
import { streaming, random } from "../videos-manager";

const videos: Controller = () => {
  const router = Router();

  router.get("/random", async (req, res) => {
    const randomVideo = await random();
    streaming(randomVideo, req, res);
  });

  return {
    router,
    url: "/videos",
  };
};

export default videos;
