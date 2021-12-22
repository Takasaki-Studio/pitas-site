import React, { Children } from "react";
import style from "./TerminalInput.module.css";

export interface TerminalInputProps {
  children?: React.ReactNode;
  onCommand?: (command: string) => void;
}

function TerminalInputComponent(
  props: TerminalInputProps,
  ref: React.Ref<HTMLInputElement>
) {
  const childrenCount = Children.count(props.children);

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const command = event.currentTarget.value;
      if (props.onCommand) {
        props.onCommand(command);
      }
      event.currentTarget.value = "";
    }
  }

  return (
    <div className="shellInput">
      {"[anonymous@ayura ~]$ "}
      {childrenCount === 0 ? (
        <input
          type="text"
          className={style.input}
          onKeyDown={handleOnKeyDown}
          ref={ref}
        />
      ) : (
        <span className={style.input}>{props.children}</span>
      )}
    </div>
  );
}

export default React.forwardRef(TerminalInputComponent);