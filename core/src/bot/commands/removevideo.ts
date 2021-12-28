import { get, remove } from "../../videos-manager";
import { Command } from "../handler";

const removeVideo: Command = {
  name: "removevideo",
  cmdOptions(builder) {
    return builder
      .setDescription("Remove a video")
      .addNumberOption((option) =>
        option
          .setRequired(true)
          .setName("index")
          .setDescription("The index of the video to remove")
      );
  },
  async execute(interaction) {
    const index = interaction.options.getNumber("index") as number;
    const video = await get(index);
    if (!video)
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Video not found",
            color: 16711680,
          },
        ],
        ephemeral: true,
      });

    await remove(video);
    interaction.reply({
      embeds: [
        {
          title: "Success",
          description: `Video ${video} removed`,
          color: 65280,
        },
      ],
      ephemeral: true,
    });
  },
};

export default removeVideo;
