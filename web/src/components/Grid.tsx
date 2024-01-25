import { useRef, useState, useEffect, useCallback } from 'react';
import Canvas from './Canvas'
import Cell from './Cell'
import { useChats } from '../hooks/useChats';
import { CHAT_ADDED } from '../graphql/queries';
import { useMouseDrag } from '../hooks/useMouseDrag';

const Grid = () => {
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { handleDragStart, handleDragEnd, handleDrag } = useMouseDrag(gridWrapperRef);
  const { chats, subscribeToMore } = useChats()
  const [clickedCell, setClickedCell] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  console.log('Grid render', clickedCell, chats, canvasSize) 
  
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

  const cellClickHandler = useCallback((id: string) => {
    setClickedCell(id);
  }, [])
  useEffect(() => {
    function deselectCell (ev: MouseEvent) {
      ev.stopPropagation()
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
