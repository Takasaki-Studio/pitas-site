import { Execultor } from "../shell";
import React from "react";

const xecho: Execultor = (args, io) => {
  io.xserver({
    content: React.createElement("div", null, args.join(" ")),
    title: "XEcho",
  });
};

export default xecho;
