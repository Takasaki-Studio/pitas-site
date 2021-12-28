import { Command } from "../handler";

import { list } from "../../videos-manager";

const listVideos: Command = {
  name: "listvideos",
  cmdOptions(builder) {
    return builder
      .setDescription("List all videos")
      .addNumberOption((option) =>
        option.setName("page").setDescription("The page number")
      );
  },
  async execute(interaction) {
    const page = interaction.options.getNumber("page") || 1;

    const videos = await list(page);
    const formatedVideos = videos.videos
      .map(({ video, index }) => {
        const videoName =
          video.length > 30 ? `${video.substring(0, 30)}...` : video;
        return `${index}. ${videoName}`;
      })
      .join("\n");
    interaction.reply({
      embeds: [
        {
          title: "Videos",
          description: formatedVideos,
          color: 53380,
          footer: {
            text: `Page ${page} of ${Math.ceil(videos.total / 10)}`,
          },
        },
      ],
      ephemeral: true,
    });
  },
};

export default listVideos;
