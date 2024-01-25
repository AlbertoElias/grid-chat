import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { FixedSizeGrid } from 'react-window'
import Canvas from './Canvas'
import Cell from './Cell'
import { useChats } from '../hooks/useChats';
import { CHAT_ADDED } from '../graphql/queries';
import { useMouseDrag } from '../hooks/useMouseDrag';

const Grid = () => {
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const { handleDragStart, handleDragEnd, handleDrag } = useMouseDrag(gridWrapperRef);
  const { chats, subscribeToMore } = useChats()
  const [clickedCell, setClickedCell] = useState<string | null>(null)
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  console.log('Grid render', clickedCell, chats, gridSize) 
  
  useEffect(() => {
    const updateGridSize = () => {
      if (gridWrapperRef.current) {
        setGridSize({
          width: gridWrapperRef.current.offsetWidth,
          height: gridWrapperRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateGridSize);
    updateGridSize();

    return () => window.removeEventListener('resize', updateGridSize);
  }, []);
  // useEffect(() => {
  //   const adjustScrollPosition = () => {
  //     if (!gridWrapperRef.current) return;
  
  //     const gridWrapper = gridWrapperRef.current;
  
  //     const wrapperMiddleX = gridWrapper.offsetWidth / 2;
  //     const wrapperMiddleY = gridWrapper.offsetHeight / 2;
  
  //     gridWrapper.scrollLeft = wrapperMiddleX;
  //     gridWrapper.scrollTop = wrapperMiddleY;
  //   };
  
  //   // Set a timeout to delay execution so that the grid has time to render and the correct width
  //   const timeout = setTimeout(adjustScrollPosition, 0);
  
  //   return () => clearTimeout(timeout);
  // }, [])
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
        return Object.assign({}, prev, {
          chats: [...prev.chats, newChat]
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const horizontalCells = 100
  const verticalCells = 100
  const cellSize = 32

  const CellRenderer = memo(({ columnIndex, rowIndex, style }: { columnIndex: number, rowIndex: number, style: React.CSSProperties }) => {
    const id = `${rowIndex},${columnIndex}`;

    const handleClick = useCallback(() => {
      console.log(id)
      setClickedCell(id);
    }, []);
  
    return (
      <Cell
        id={id}
        style={style}
        onClick={handleClick}
        clickedCell={clickedCell === id}
        chat={chats?.get(id)}
      />
    );
  });

  return (
    <div className='p-4 flex-1 flex justify-center overflow-hidden'>
      <div className='relative h-full w-full' ref={gridWrapperRef} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={handleDrag}>
        <FixedSizeGrid
          columnCount={horizontalCells}
          columnWidth={cellSize}
          height={gridSize.height}
          rowCount={verticalCells}
          rowHeight={cellSize}
          width={gridSize.width}
          className='flex flex-col no-scrollbar'
          style={{ position: 'absolute' }}
        >
          {CellRenderer}
        </FixedSizeGrid>
        <Canvas width={gridSize.width} height={gridSize.height} />
      </div>
    </div>
  )
}

export default Grid
