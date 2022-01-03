import { get, remove } from "../../images-manager";
import { Command } from "../handler";

const removeimage: Command = {
  name: "removeimage",
  cmdOptions(builder) {
    return builder
      .setDescription("Remove a image")
      .addNumberOption((option) =>
        option
          .setRequired(true)
          .setName("index")
          .setDescription("The index of the image to remove")
      );
  },
  async execute(interaction) {
    const index = interaction.options.getNumber("index") as number;
    const image = await get(index);
    if (!image)
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "image not found",
            color: 16711680,
          },
        ],
        ephemeral: true,
      });

    await remove(image);
    interaction.reply({
      embeds: [
        {
          title: "Success",
          description: `image ${image} removed`,
          color: 65280,
        },
      ],
      ephemeral: true,
    });
  },
};

export default removeimage;
