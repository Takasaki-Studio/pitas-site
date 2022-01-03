import { Execultor } from "../shell";
import App from '../../App'


function AyuraMoe () {
  return (
    <div>
      <App />
    </div>
  )
}

const test: Execultor = (args, cli) => {
  cli.xserver({
    title: document.title,
    content: <AyuraMoe />
  })
};

export default test;
