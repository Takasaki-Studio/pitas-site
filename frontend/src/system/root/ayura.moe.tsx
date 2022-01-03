import { Execultor } from "../shell";
import App from "../../App";

function AyuraMoe() {
  return (
    <div>
      <App />
    </div>
  );
}

const Ayura_Moe: Execultor = (args, cli) => {
  cli.xserver({
    title: document.title,
    content: <AyuraMoe />,
  });
};

export default Ayura_Moe;
