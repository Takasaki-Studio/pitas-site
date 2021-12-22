import React, { useState } from "react";
import WindowComponent, { WindowComponentProps } from "./Window";

function XServerComponent() {
  const [windows, setWindows] = useState<WindowComponentProps[]>([
    {
      content: <div>Hello World</div>,
      pid: 1,
      title: "Welcome to XServer",
      height: 200,
      width: 200,
      x: 120,
      y: 120,
    },
    {
      content: <div>Hello World</div>,
      pid: 2,
      title: "Welcome to XServer",
      height: 200,
      width: 200,
      x: 120,
      y: 120,
    },
  ]);

  return (
    <>
      {windows.map((window) => (
        <WindowComponent {...window} key={window.pid} />
      ))}
    </>
  );
}

export default XServerComponent;
