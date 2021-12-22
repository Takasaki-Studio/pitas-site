import { useRef, useState, useEffect } from "react";
import { useMouseLocale, MouseData } from "../hooks";
import style from "./Window.module.css";

export interface WindowComponentProps {
  pid: number;
  title: string;
  height: number;
  width: number;
  x: number;
  y: number;
  content: JSX.Element;
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

  return (
    <div
      className={style.window}
      style={{
        height: `${props.height}px`,
        width: `${props.width}px`,
        left: `${mouseData.x}px`,
        top: `${mouseData.y}px`,
      }}
      ref={windowRef}
    >
      <div className={style.titleBar} ref={titleRef}>
        {props.title}
        <span className={style.closeButton}>X</span>
      </div>
    </div>
  );
}

export default WindowComponent;
