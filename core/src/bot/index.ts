import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";
import { getCommands, handleCommand } from "./handler";

async function startBot(db: PrismaClient) {
  const client = new Client({
    intents: [],
  });

  const commands = await getCommands();

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    handleCommand(commands, interaction, db);
  });

  const token = process.env.DISCORD_TOKEN;
  if (!token) throw new Error("DISCORD_TOKEN is not defined");

  client.login(token);
}

export default startBot;
