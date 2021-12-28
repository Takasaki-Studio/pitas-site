import { create } from "youtube-dl-exec";
import path from "path";

export async function download(url: string) {
  const ytdl = create(path.join(__dirname, "..", "bin", "yt-dlp"));

  await ytdl(url, {
    format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
    output: "videos/%(title)s.%(ext)s",
  });
}
