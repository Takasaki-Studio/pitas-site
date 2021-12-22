import { useState, useEffect } from "react";

export interface MouseData {
  x: number;
  y: number;
  isDown: boolean;
}

export interface MouseProps {
  mainRef: React.RefObject<HTMLDivElement>;
  secondaryRef?: React.RefObject<HTMLDivElement>;
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
    if (!props.mainRef.current) return;

    const referencia = props.secondaryRef || props.mainRef;

    if (!referencia.current) return;

    function mouseDown(e: MouseEvent) {
      if (!referencia.current) return;
      e.preventDefault();
      setOffset([
        e.clientX - referencia.current.offsetLeft,
        e.clientY - referencia.current.offsetTop,
      ]);
      setIsDragging(true);
    }

    props.mainRef.current.addEventListener("mousedown", mouseDown, true);

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
      props.mainRef.current!.removeEventListener("mousedown", mouseDown, true);
      document.removeEventListener("mouseup", mouseUp, true);
      document.removeEventListener("mousemove", mouseMove, true);
    };
  }, [props.mainRef, props.secondaryRef, isDragging, offset]);

  return mouse;
}
