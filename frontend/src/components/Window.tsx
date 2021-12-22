import { useRef, useState, useEffect } from "react";
import { useMouseLocale, MouseData } from "../hooks";
import classNames from "classnames";
import style from "./Window.module.css";

export interface WindowComponentProps {
  pid: number;
  title: string;
  height: number;
  width: number;
  x: number;
  y: number;
  content: JSX.Element;
  primary: boolean;
  onFocus?: (pid: number) => void;
  onClose?: (pid: number) => void;
}

function WindowComponent(props: WindowComponentProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [mouseData, setMouseData] = useState<MouseData>({
    x: props.x,
    y: props.y,
    isDown: false,
  });

  const mouse = useMouseLocale({
    mainRef: titleRef,
    secondaryRef: windowRef,
  });

  useEffect(() => {
    if (mouse.isDown) {
      const { x, y, isDown } = mouse;
      setMouseData({
        x,
        y,
        isDown,
      });
    }
  }, [mouse]);

  function onClickHandler() {
    props.onFocus && props.onFocus(props.pid);
  }

  function onCloseHandler() {
    props.onClose && props.onClose(props.pid);
  }

  return (
    <div
      className={classNames([
        style.window,
        { [style.selected]: props.primary },
        { [style.onMove]: mouse.isDown },
      ])}
      style={{
        height: `${props.height}px`,
        width: `${props.width}px`,
        left: `${mouseData.x}px`,
        top: `${mouseData.y}px`,
      }}
      ref={windowRef}
      onClick={onClickHandler}
    >
      <div className={style.titleBar} ref={titleRef}>
        {props.title}
        <span onClick={onCloseHandler} className={style.closeButton}>
          X
        </span>
      </div>
      <div className={style.content}>{props.content}</div>
    </div>
  );
}

export default WindowComponent;
