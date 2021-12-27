import { Controller } from "../handler";
import { Router } from "express";

const index: Controller = () => {
  const router = Router();
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });
  return {
    router,
    url: "/",
  };
};

export default index;
