import { useState } from "react";
import TerminalInputComponent from "./components/TerminalInput";
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

function App() {
  const [commands, setCommands] = useState<string[]>([]);

  function addCommand(command: string) {
    setCommands([...commands, command]);
  }

  return (
    <div>
      <p className={style.wrap}>{initialText}</p>
      {commands.map((cmd) => (
        <TerminalInputComponent>{cmd}</TerminalInputComponent>
      ))}
      <TerminalInputComponent onCommand={addCommand} />
    </div>
  );
}

export default App;
