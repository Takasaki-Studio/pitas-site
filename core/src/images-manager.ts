import path from "path";
import fs from "fs/promises";
import axios from "axios";
import mime from "mime-types";
import PitasError from "./PitasError";

const imageFolder = path.join(__dirname, "..", "images");

export async function download(url: string, name: string) {
  try {
    await fs.readdir(imageFolder);
  } catch (error) {
    await fs.mkdir(imageFolder, { recursive: true });
  }

  const imageExtensions = [
    "apng",
    "avif",
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp",
    "bmp",
    "ico",
    "tiff",
  ];

  const validateFileReq = await axios.head(url);

  if (
    !imageExtensions.includes(
      mime
        .extension(validateFileReq.headers["content-type"])
        .toString()
        .toLowerCase()
    )
  ) {
    throw new PitasError("Invalid File, it must be an image!");
  }

  if (Number(validateFileReq.headers["content-length"]) > 104857600) {
    throw new PitasError("File size too big, it must be less than 100mb");
  }

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const extension = mime.extension(response.headers["content-type"]);

  name = name
    .trim()
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  await fs.writeFile(
    path.join(imageFolder, `${name}.${extension as string}`),
    response.data
  );
}

export async function list(page = 1) {
  const images = await fs.readdir(imageFolder);
  const imagesFormated = images
    .map((image, index) => ({ image, index }))
    .slice((page - 1) * 10, page * 10);
  return {
    images: imagesFormated,
    total: images.length,
  };
}

export async function get(index: number): Promise<string | undefined> {
  const images = await fs.readdir(imageFolder);
  const image = images[index];
  return image;
}

export async function remove(image: string) {
  await fs.unlink(path.join(imageFolder, image));
}

export async function random() {
  const images = await fs.readdir(imageFolder);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
