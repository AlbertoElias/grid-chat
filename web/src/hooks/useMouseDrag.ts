import { useState, useRef, useCallback, MouseEvent } from "react";

export const useMouseDrag = (elRef: React.RefObject<HTMLElement>) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0
  });
  const handleDragStart = useCallback((e: MouseEvent) => {
    if (!elRef.current) return
    const slider = elRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
    setIsMouseDown(true)
    elRef.current.style.cursor = "grabbing !important"
  }, [])
  const handleDragEnd = useCallback(() => {
      setIsMouseDown(false)
      if (!elRef.current) return
      document.body.style.cursor = "default"
  }, [])
  const handleDrag = useCallback((e: MouseEvent) => {
      if (!isMouseDown || !elRef.current) return;
      e.preventDefault();
      const slider = elRef.current;
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - mouseCoords.current.startX) * 1.5;
      const walkY = (y - mouseCoords.current.startY) * 1.5;
      slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
      slider.scrollTop = mouseCoords.current.scrollTop - walkY;
  }, [isMouseDown])

  return {
    handleDragStart,
    handleDragEnd,
    handleDrag
  }
}