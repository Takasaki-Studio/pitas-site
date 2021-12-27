import { Command } from "../handler";

const pitasgay: Command = {
  name: "pitasgay",
  cmdOptions(builder) {
    return builder.setDescription("Pitas is");
  },
  async execute(interaction) {
    interaction.reply("Pitas is Gay");
  },
};

export default pitasgay;
