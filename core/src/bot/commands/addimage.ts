import npmlog from "npmlog";
import { download } from "../../images-manager";
import PitasError from "../../PitasError";
import { Command } from "../handler";

const pitasgay: Command = {
  name: "addimage",
  cmdOptions(builder) {
    return builder
      .setDescription("Create an waifu image on the website :D")
      .addStringOption((option) =>
        option
          .setDescription("The url of the image")
          .setName("url")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setDescription("The name of the image")
          .setName("name")
          .setRequired(true)
      );
  },
  async execute(interaction) {
    const url = interaction.options.getString("url") as string;
    const name = interaction.options.getString("name") as string;

    await interaction.reply({
      embeds: [
        {
          title: "Downloading image",
          description: "This may take a while",
          color: 53380,
        },
      ],
      ephemeral: true,
    });

    try {
      await download(url, name);
      interaction.followUp({
        embeds: [
          {
            title: "Image downloaded",
            description: "The image is now available on the website",
            color: 53380,
          },
        ],
        ephemeral: true,
      });
    } catch (e) {
      if (e instanceof PitasError) {
        interaction.followUp({
          embeds: [
            {
              title: "Error while downloading image",
              description: e.message,
              color: 15406156,
            },
          ],
          ephemeral: true,
        });

        return;
      }
      npmlog.error("commands/addimage", "Error while downloading image", e);
      interaction.followUp({
        embeds: [
          {
            title: "Error while downloading image",
            description: "Please check url and try again",
            color: 15406156,
          },
        ],
        ephemeral: true,
      });
    }
  },
};

export default pitasgay;
