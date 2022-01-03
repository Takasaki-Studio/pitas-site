import { Command } from "../handler";

import { list } from "../../images-manager";

const listimages: Command = {
  name: "listimages",
  cmdOptions(builder) {
    return builder
      .setDescription("List all images")
      .addNumberOption((option) =>
        option.setName("page").setDescription("The page number")
      );
  },
  async execute(interaction) {
    const page = interaction.options.getNumber("page") || 1;

    const images = await list(page);
    const formatedimages = images.images
      .map(({ image, index }) => {
        const imageName =
          image.length > 30 ? `${image.substring(0, 30)}...` : image;
        return `${index}. ${imageName}`;
      })
      .join("\n");
    interaction.reply({
      embeds: [
        {
          title: "images",
          description: formatedimages,
          color: 53380,
          footer: {
            text: `Page ${page} of ${Math.ceil(images.total / 10)}`,
          },
        },
      ],
      ephemeral: true,
    });
  },
};

export default listimages;
