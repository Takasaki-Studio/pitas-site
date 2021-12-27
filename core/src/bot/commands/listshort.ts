import { Command } from "../handler";

const listShort: Command = {
  name: "listshort",
  cmdOptions(builder) {
    return builder
      .setDescription("List all short urls")
      .addNumberOption((option) =>
        option.setName("page").setDescription("The page number")
      );
  },
  async execute(interaction, db) {
    const page = interaction.options.getNumber("page") || 1;

    const links = await db.links.findMany({
      take: 10,
      skip: (page - 1) * 10,
    });

    const totalItens = await db.links.count();

    const idMaxLenght = links
      .map((link) => link.id.length)
      .reduce((a, b) => Math.max(a, b), 0);

    const tableRowns = links
      .map(
        (link) =>
          `${link.id.padEnd(idMaxLenght)} | ${
            link.url.length > 20 ? `${link.url.substring(0, 20)}...` : link.url
          }`
      )
      .join("\n");
    const table = `\`\`\`\n${tableRowns}\n\`\`\``;

    const finalDescription = idMaxLenght ? table : "No short urls";

    interaction.reply({
      embeds: [
        {
          title: "Short urls",
          description: finalDescription,
          color: 53380,
          footer: {
            text: `Page ${page} of ${Math.ceil(totalItens / 10)}`,
          },
        },
      ],
      ephemeral: true,
    });
  },
};

export default listShort;
