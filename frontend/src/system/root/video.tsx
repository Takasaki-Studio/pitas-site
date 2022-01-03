import { Execultor } from "../shell";
import { useEffect, useRef } from "react";
import axios from "axios";

function Interface() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    axios.get("/api/videos/random").then((res) => {
      if (!videoRef.current) return;
      videoRef.current.src = `/videos/${res.data.video}`;
      videoRef.current.play();
    });
  }, [videoRef]);

  return (
    <video ref={videoRef} width={720} height={480} autoPlay controls></video>
  );
}

const video: Execultor = (args, io) => {
  io.xserver({
    title: "Video",
    content: <Interface />,
  });
};

export default video;
