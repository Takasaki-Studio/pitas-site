import { useState, useEffect, useRef } from "react";
import TerminalInputComponent from "./components/TerminalInput";
import shell from "./system/shell";
import style from "./App.module.css";

const initialText = `
    /\\
   /  \\  _   _ _   _ _ __ __ _
  / /\\ \\| | | | | | | '__/ _\` |
 / ____ \\ |_| | |_| | | | (_| |
/_/    \\_\\__, |\\__,_|_|  \\__,_|
         __/ |
        |___/

`;

export interface Command {
  command: string;
  response?: string;
}

function App() {
  const [commands, setCommands] = useState<Command[]>([]);
  const inputTerminal = useRef<HTMLInputElement>(null);
  useEffect(() => {
    window.scroll(0, document.body.scrollHeight);
    if (inputTerminal.current) inputTerminal.current.focus();
  });

  async function addCommand(command: string) {
    let updatedCommands = false;

    const response = await shell(command, {
      commands,
      stdout: (newCommands: Command[]) => {
        updatedCommands = true;
        setCommands(newCommands);
      },
    });

    if (!updatedCommands) {
      setCommands([
        ...commands,
        {
          command,
          response,
        },
      ]);
    }
  }

  return (
    <div>
      <p className={style.wrap}>{initialText}</p>
      {commands.map((cmd, index) => (
        <div key={index}>
          <TerminalInputComponent>{cmd.command}</TerminalInputComponent>
          {cmd.response && <span className={style.cmdOut}>{cmd.response}</span>}
        </div>
      ))}
      <TerminalInputComponent onCommand={addCommand} ref={inputTerminal} />
    </div>
  );
}

export default App;
