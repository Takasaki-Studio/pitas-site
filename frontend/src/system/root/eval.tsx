import { Execultor } from "../shell";

export interface LinkProps {
  code: string
}

function Eval (
  props: LinkProps
) {
  return (
    <div dangerouslySetInnerHTML={{__html: props.code}} />
  )
}

const evalCommand: Execultor = (args, cli) => {
  const htmlCode = args.join(" ")

  cli.xserver({
    title: document.title,
    content: <Eval code={htmlCode} />
  })
};

export default evalCommand;
