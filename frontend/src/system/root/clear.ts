import { Execultor } from "../shell";

const clear: Execultor = (args, cli) => {
  cli.stdout([]);
};

export default clear;
