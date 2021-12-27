import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { PrismaClient } from "@prisma/client";
import { Routes } from "discord-api-types/v9";
import { CacheType, CommandInteraction, Interaction } from "discord.js";
import glob from "glob";
import npmlog from "npmlog";

export type CommandExecultor = (
  interaction: CommandInteraction,
  db: PrismaClient
) => Promise<void>;

export interface Command {
  name: string;
  execute: CommandExecultor;
  cmdOptions: (builder: SlashCommandBuilder) => SlashCommandBuilder;
}

export interface CommandHandled {
  name: string;
  executor: CommandExecultor;
}

function globPromise(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, {}, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

export async function getCommands() {
  const clientId = process.env.DISCORD_CLIENT;
  if (!clientId) throw new Error("DISCORD_CLIENT is not defined");
  const guild = process.env.DISCORD_GUILD;
  if (!guild) throw new Error("DISCORD_GUILD is not defined");
  const token = process.env.DISCORD_TOKEN;
  if (!token) throw new Error("DISCORD_TOKEN is not defined");

  npmlog.log("info", "bot/handler", "Loading commands...");

  try {
    const files = await globPromise(`${__dirname}/commands/**/*.{js,ts}`);
    const commands = files.map(
      async (file) => (await import(file)).default as Command
    );
    const commandsList = await Promise.all(commands);
    const commandsBuilded = commandsList.map((cmd) => {
      const builder = new SlashCommandBuilder();
      builder.setName(cmd.name);
      const configuredBuild = cmd.cmdOptions(builder);
      npmlog.log("info", "bot/handler", `Command ${cmd.name} loaded`);
      return configuredBuild.toJSON();
    });

    const rest = new REST({
      version: "9",
    }).setToken(token);

    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guild), {
        body: commandsBuilded,
      });
      npmlog.log("info", "bot/handler", "Commands loaded");
    } catch (e) {
      npmlog.error("bot/handler", "Error loading commands %s", e);
    }

    return commandsList.map((cmd) => ({
      name: cmd.name,
      executor: cmd.execute,
    }));
  } catch {
    npmlog.error("bot/handler", "Error loading commands");
    return [];
  }
}

export async function handleCommand(
  commands: CommandHandled[],
  interaction: Interaction<CacheType>,
  db: PrismaClient
) {
  const cmdInteraction = interaction as CommandInteraction;
  const command = commands.find(
    (cmd) => cmd.name === cmdInteraction.commandName
  );
  if (!command) return;

  command.executor(cmdInteraction, db);
}
