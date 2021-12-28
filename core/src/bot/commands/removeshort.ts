import { Command } from "../handler";

const removeShort: Command = {
  name: "removeshort",
  cmdOptions(builder) {
    return builder
      .setDescription("Remove a short url")
      .addStringOption((option) =>
        option
          .setName("id")
          .setRequired(true)
          .setDescription("The id of the short url")
      );
  },
  async execute(interaction, db) {
    const id = interaction.options.getString("id") as string;
    const link = await db.links.findUnique({ where: { id } });

    if (!link) {
      return interaction.reply({
        embeds: [
          {
            color: 15406156,
            title: "Short url not found",
          },
        ],
        ephemeral: true,
      });
    }

    await db.links.delete({ where: { id } });
    interaction.reply({
      embeds: [
        {
          color: 53380,
          title: "Short url removed",
        },
      ],
      ephemeral: true,
    });
  },
};

export default removeShort;
