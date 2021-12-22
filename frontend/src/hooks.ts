import { useState, useEffect } from "react";

export interface MouseData {
  x: number;
  y: number;
  isDown: boolean;
}

export interface MouseProps {
  ref: React.RefObject<HTMLDivElement>;
}

export function useMouseLocale(props: MouseProps) {
  const [mouse, setMouse] = useState<MouseData>({
    isDown: false,
    x: 0,
    y: 0,
  });

  const [offset, setOffset] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!props.ref.current) return;

    function mouseDown(e: MouseEvent) {
      e.preventDefault();
      if (!props.ref.current) return;
      setOffset([
        e.clientX - props.ref.current.offsetLeft,
        e.clientY - props.ref.current.offsetTop,
      ]);
      setIsDragging(true);
    }

    props.ref.current.addEventListener("mousedown", mouseDown, true);

    function mouseUp(e: MouseEvent) {
      setIsDragging(false);
      setMouse((m) => ({ ...m, isDown: false }));
    }

    document.addEventListener("mouseup", mouseUp, true);

    function mouseMove(e: MouseEvent) {
      e.preventDefault();

      if (isDragging) {
        const mousePosition = {
          x: e.clientX,
          y: e.clientY,
        };

        setMouse({
          x: mousePosition.x - offset[0],
          y: mousePosition.y - offset[1],
          isDown: true,
        });
      }
    }

    document.addEventListener("mousemove", mouseMove, true);

    return () => {
      props.ref.current!.removeEventListener("mousedown", mouseDown, true);
      document.removeEventListener("mouseup", mouseUp, true);
      document.removeEventListener("mousemove", mouseMove, true);
    };
  }, [props.ref, isDragging, offset]);

  return mouse;
}
