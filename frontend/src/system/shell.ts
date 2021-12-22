import { Command } from "../App";

export interface CliInterface {
  stdout: (commands: Command[]) => void;
  commands: Command[];
}

export type Execultor = (args: string[], cli: CliInterface) => string | void;

async function shell(
  cmd: string,
  cli: CliInterface
): Promise<string | undefined> {
  if (!cmd) return;
  try {
    const [command, ...args] = cmd.split(" ");

    const item = await import(`./root/${command}`);
    return item.default(args, cli);
  } catch {
    return `bash: ${cmd}: command not found...`;
  }
}

export default shell;
