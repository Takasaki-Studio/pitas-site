import { useState } from "react";
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
      primary: true,
    },
    {
      content: <div>Hello World</div>,
      pid: 2,
      title: "Welcome to XServer",
      height: 200,
      width: 200,
      x: 120,
      y: 120,
      primary: false,
    },
  ]);

  function onFocusHandler(pid: number) {
    const oldActivity = windows.find((window) => window.primary);
    const newFocus = windows.find((window) => window.pid === pid);

    if (oldActivity && newFocus) {
      if (oldActivity.pid !== newFocus.pid) {
        oldActivity.primary = false;
        newFocus.primary = true;
        setWindows([...windows]);
      }
    }
  }

  function onCloseHandler(pid: number) {
    const newWindows = windows.filter((window) => window.pid !== pid);
    console.log(newWindows);
    setWindows(newWindows);
  }

  return (
    <>
      {windows.map((window) => (
        <WindowComponent
          {...window}
          onFocus={onFocusHandler}
          onClose={onCloseHandler}
          key={window.pid}
        />
      ))}
    </>
  );
}

export default XServerComponent;
