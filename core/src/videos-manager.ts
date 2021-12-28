import { create } from "youtube-dl-exec";
import path from "path";
import fs from "fs/promises";

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
