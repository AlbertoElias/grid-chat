import { useRef, useState, useEffect, MouseEvent } from 'react';
import Canvas from './Canvas'
import Cell from './Cell'
import { useChats } from '../hooks/useChats';
import { CHAT_ADDED } from '../graphql/queries';

function Grid () {
  const { chats, subscribeToMore } = useChats()
  const [clickedCell, setClickedCell] = useState<string | null>(null)
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0
  });
  const handleDragStart = (e: MouseEvent) => {
    if (!gridWrapperRef.current) return
    const slider = gridWrapperRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
    setIsMouseDown(true)
    document.body.style.cursor = "grabbing"
  }
  const handleDragEnd = () => {
      setIsMouseDown(false)
      if (!gridWrapperRef.current) return
      document.body.style.cursor = "default"
  }
  const handleDrag = (e: MouseEvent) => {
      if (!isMouseDown || ! gridWrapperRef.current) return;
      e.preventDefault();
      const slider = gridWrapperRef.current;
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - mouseCoords.current.startX) * 1.5;
      const walkY = (y - mouseCoords.current.startY) * 1.5;
      slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
      slider.scrollTop = mouseCoords.current.scrollTop - walkY;
  }
  useEffect(() => {
    const updateCanvasSize = () => {
      if (gridRef.current) {
        setCanvasSize({
          width: gridRef.current.offsetWidth,
          height: gridRef.current.offsetHeight
        })
      }
    }

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  useEffect(() => {
    const adjustScrollPosition = () => {
      if (!gridWrapperRef.current || !gridRef.current) return;
  
      const gridWrapper = gridWrapperRef.current;
      const grid = gridRef.current;
  
      const gridMiddleX = grid.offsetWidth / 2;
      const gridMiddleY = grid.offsetHeight / 2;
      const wrapperMiddleX = gridWrapper.offsetWidth / 2;
      const wrapperMiddleY = gridWrapper.offsetHeight / 2;
  
      gridWrapper.scrollLeft = gridMiddleX - wrapperMiddleX;
      gridWrapper.scrollTop = gridMiddleY - wrapperMiddleY;
    };
  
    // Set a timeout to delay execution so that the grid has time to render and the correct width
    const timeout = setTimeout(adjustScrollPosition, 0);
  
    return () => clearTimeout(timeout);
  }, [])

  function cellClickHandler (id: string) {
    setClickedCell(id);
  }

  useEffect(() => {
    function deselectCell () {
      setClickedCell(null)
    }

    document.body.addEventListener('click', deselectCell)
    return () => document.body.removeEventListener('click', deselectCell)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: CHAT_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newChat = subscriptionData.data.chatAdded
        console.log(newChat)
        return Object.assign({}, prev, {
          chats: [...prev.chats, newChat]
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const horizontalCells = 100
  const verticalCells = 100

  const rows = []

  for (let i = 0; i < horizontalCells; i++) {
    const row = []
    for (let j = 0; j < verticalCells; j++) {
      const id = `${i},${j}`
      // const c = chats?.get(id)
      // if (c) console.log(c)
      row.push(
        <Cell
          id={id}
          key={id}
          onClick={cellClickHandler}
          clickedCell={clickedCell === id}
          chat={chats?.get(id)}
        ></Cell>
      )
    }
    rows.push(<div className='flex' key={`row-${i}`}>{row}</div>)
  }

  return (
    <div className='p-4 flex-1 flex justify-center overflow-hidden'>
      <div className='relative overflow-scroll no-scrollbar h-full' ref={gridWrapperRef} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={handleDrag}>
        <div className='flex flex-col absolute' ref={gridRef}>{rows}</div>
        <Canvas width={canvasSize.width} height={canvasSize.height} />
      </div>
    </div>
  )
}

export default Grid
