import { Command } from "../handler";
import crypto from "crypto";

const addShort: Command = {
  name: "addshort",
  cmdOptions(builder) {
    return builder
      .setDescription("Add a short url")
      .addStringOption((option) =>
        option
          .setName("url")
          .setRequired(true)
          .setDescription("The url to shorten")
      )
      .addStringOption((option) =>
        option
          .setName("custom-name")
          .setDescription("The custom name for the short url")
      );
  },
  async execute(interaction, db) {
    const url = interaction.options.getString("url") as string;
    const customName = interaction.options.getString("custom-name");

    const shortUrl =
      customName ||
      crypto.createHash("sha512").update(url).digest("base64").substring(0, 7);

    const existentUrl = await db.links.findUnique({
      where: { id: shortUrl },
      select: { id: true },
    });

    if (!existentUrl) {
      const finalUrl = url.startsWith("http") ? url : `http://${url}`;

      await db.links.create({
        data: {
          id: shortUrl,
          url: finalUrl,
        },
      });
    }

    interaction.reply({
      embeds: [
        {
          title: "Short url created",
          description: `Id: ${shortUrl}`,
        },
      ],
      ephemeral: true,
    });
  },
};

export default addShort;
