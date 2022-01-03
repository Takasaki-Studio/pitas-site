import { forwardRef, useImperativeHandle, useState } from "react";
import WindowComponent, { WindowComponentProps } from "./Window";

export interface RequestedWindow {
  title: string;
  content: JSX.Element;
}

export interface XServerRef {
  addWindow: (window: RequestedWindow) => void;
}

export interface XServerProps {}

function XServerComponent(
  props: XServerProps,
  ref: React.ForwardedRef<XServerRef>
) {
  const [windows, setWindows] = useState<WindowComponentProps[]>([]);
  const [lastPid, setLastPid] = useState(0);
  useImperativeHandle(ref, () => ({
    addWindow: (window: RequestedWindow) => {
      setWindows([
        ...windows,
        {
          pid: lastPid + 1,
          title: window.title,
          content: window.content,
          height: 500,
          width: 720,
          x: 150,
          y: 150,
          primary: false,
        },
      ]);
      setLastPid(lastPid + 1);
    },
  }));

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

export default forwardRef<XServerRef, XServerProps>(XServerComponent);
