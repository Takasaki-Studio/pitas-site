import { create } from "youtube-dl-exec";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Request, Response } from "express";

const videoFolder = path.join(__dirname, "..", "videos");
const ytdl = create(path.join(__dirname, "..", "bin", "yt-dlp"));

export async function download(url: string) {
  await ytdl(url, {
    format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
    output: "videos/%(title)s.%(ext)s",
  });
}

export async function list(page = 1) {
  const videos = await fs.readdir(videoFolder);
  const videosFormated = videos.slice((page - 1) * 10, page * 10);
  return {
    videos: videosFormated,
    total: videos.length,
  };
}

export async function random() {
  const videos = await fs.readdir(videoFolder);
  const randomIndex = Math.floor(Math.random() * videos.length);
  return videos[randomIndex];
}

export async function streaming(name: string, req: Request, res: Response) {
  const file = path.join(videoFolder, name);
  try {
    const stats = await fs.stat(file);
    const { range } = req.headers;
    const { size } = stats;
    const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);
    const end = size - 1;
    const chunksize = end - start + 1;
    res.set({
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    });

    res.status(206);
    const stream = createReadStream(file, { start, end });
    stream.on("open", () => stream.pipe(res));
    stream.on("error", (err) => res.end(err));
  } catch {
    return res.status(404).send("File not found");
  }
}
