import { Execultor } from "../shell";

interface Command {
  name: string;
  description: string;
}

const commandList: Command[] = [
  {
    name: "help",
    description: "Shows this list of all commands",
  },
  {
    name: "clear",
    description: "Clears the console",
  },
  {
    name: "echo",
    description: "Repeats what you type",
  },
  {
    name: "ayura.moe",
    description: "Guess what",
  },
  {
    name: "video",
    description: "Gets a random video :D",
  },
  {
    name: "waifu",
    description: "Gets a random waifu picture :D",
  },
];

const help: Execultor = (args, io) => {
  return commandList
    .map((command) => `- ${command.name}: ${command.description}`)
    .join("\n");
};

export default help;
