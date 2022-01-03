import React, { Children, useEffect, useState } from "react";
import { Command } from "../App";
import style from "./TerminalInput.module.css";

export interface TerminalInputProps {
  children?: React.ReactNode;
  onCommand?: (command: string) => void;
  commands?: Command[];
}

function TerminalInputComponent(
  props: TerminalInputProps,
  ref: React.Ref<HTMLInputElement>
) {
  const childrenCount = Children.count(props.children);
  const [lastCommandIndex, setLastCommandIndex] = useState(0);

  useEffect(() => {
    if ((props.commands?.length as number) === 0) {
      setLastCommandIndex(0);
    } else {
      setLastCommandIndex((props.commands?.length as number) - 1);
    }
  }, [props.commands]);

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    function handleArrowEvent(type: "ArrowUp" | "ArrowDown"): string {
      let returnString = "";

      if ((props.commands?.length as number) > 0) {
        returnString = props.commands![lastCommandIndex].command;
      }

      if (type === "ArrowUp") {
        if (lastCommandIndex - 1 < 0) {
          setLastCommandIndex(0);
        } else {
          setLastCommandIndex(lastCommandIndex - 1);
        }
      } else if (type === "ArrowDown") {
        if (lastCommandIndex + 1 > (props.commands?.length as number) - 1) {
          setLastCommandIndex((props.commands?.length as number) - 1);
        } else {
          setLastCommandIndex(lastCommandIndex + 1);
        }
      }

      return returnString;
    }

    if (event.key === "ArrowUp") {
      event.currentTarget.value = handleArrowEvent("ArrowUp");
    }

    if (event.key === "ArrowDown") {
      event.currentTarget.value = handleArrowEvent("ArrowDown");
    }

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
