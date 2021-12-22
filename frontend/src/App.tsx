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

interface Command {
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
    const response = await shell(command);
    setCommands([
      ...commands,
      {
        command,
        response,
      },
    ]);
  }

  return (
    <div>
      <p className={style.wrap}>{initialText}</p>
      {commands.map((cmd, index) => (
        <>
          <TerminalInputComponent key={index}>
            {cmd.command}
          </TerminalInputComponent>
          {cmd.response && <span className={style.cmdOut}>{cmd.response}</span>}
        </>
      ))}
      <TerminalInputComponent onCommand={addCommand} ref={inputTerminal} />
    </div>
  );
}

export default App;
