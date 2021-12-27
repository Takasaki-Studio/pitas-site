import { Client } from "discord.js";
import { getCommands, handleCommand } from "./handler";

async function startBot() {
  const client = new Client({
    intents: [],
  });

  const commands = await getCommands();

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    handleCommand(commands, interaction);
  });

  const token = process.env.DISCORD_TOKEN;
  if (!token) throw new Error("DISCORD_TOKEN is not defined");

  client.login(token);
}

export default startBot;
