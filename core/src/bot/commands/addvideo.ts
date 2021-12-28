import { Command } from "../handler";
import npmlog from "npmlog";

import { download } from "../../videos-manager";

const addVideo: Command = {
  name: "addvideo",
  cmdOptions(builder) {
    return builder
      .setDescription("Add a video to the website")
      .addStringOption((option) =>
        option
          .setDescription("The url of the video")
          .setName("url")
          .setRequired(true)
      );
  },
  async execute(interaction) {
    const url = interaction.options.getString("url") as string;

    interaction.reply({
      embeds: [
        {
          title: "Downloading video",
          description: "This may take a while",
          color: 53380,
        },
      ],
      ephemeral: true,
    });

    try {
      await download(url);
      interaction.followUp({
        embeds: [
          {
            title: "Video downloaded",
            description: "The video is now available on the website",
            color: 53380,
          },
        ],
        ephemeral: true,
      });
    } catch (e) {
      npmlog.error("commands/addvideo", "Error while downloading video", e);
      interaction.followUp({
        embeds: [
          {
            title: "Error while downloading video",
            description: "Please check url and try again",
            color: 15406156,
          },
        ],
        ephemeral: true,
      });
    }
  },
};

export default addVideo;
