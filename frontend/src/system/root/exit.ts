import { Execultor } from "../shell";

const exit: Execultor = (args, cli) => {
  setTimeout(() => {
    window.close();
  }, 1000);
  return "Bye~";
};

export default exit;
