import { Execultor } from "../shell";
import { useEffect, useState } from "react";
import axios from "axios";

function Interface() {
  const [image, setImage] = useState('')

  useEffect(() => {
    axios.get("/api/images/random").then((res) => {
      setImage(res.data.image)
    });
  })

  return (
    <img alt={image} src={`/images/${image}`} width={720} height={480} />
  );
}

const video: Execultor = (args, io) => {
  io.xserver({
    title: "Waifu",
    content: <Interface />,
  });
};

export default video;
