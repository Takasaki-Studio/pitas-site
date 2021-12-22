import { Command } from "../App";
import { RequestedWindow } from "../components/XServer";
export interface CliInterface {
  stdout: (commands: Command[]) => void;
  xServerAddWindow: (window: RequestedWindow) => void;
  commands: Command[];
}

export interface IO {
  stdout: (commands: Command[]) => void;
  xserver: (window: RequestedWindow) => void;
}

export type Execultor = (args: string[], io: IO) => string | void;

async function shell(
  cmd: string,
  cli: CliInterface
): Promise<string | undefined> {
  if (!cmd) return;
  try {
    const [command, ...args] = cmd.split(" ");

    const item = await import(`./root/${command}`);
    return item.default(args, {
      stdout: cli.stdout,
      xserver: cli.xServerAddWindow,
    } as IO);
  } catch {
    return `bash: ${cmd}: command not found...`;
  }
}

export default shell;
