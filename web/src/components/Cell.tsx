import { useContext } from "react";
import { ClickedCellContext } from "../context/ClickedCellContext";
import Bubble from "./Bubble";
import Login from "./Login";
import { useAuth } from "../hooks/useAuth";

interface CellProps {
  id: string;
  children?: React.ReactNode;
}

function Cell ({ id, children }: CellProps) {
  const { clickedCell, setClickedCell } = useContext(ClickedCellContext)
  const { user } = useAuth()
  function clickHandler (ev: React.MouseEvent<HTMLDivElement>) {
    ev.stopPropagation();
    console.log(id);
    setClickedCell(id);
  }

  const chat = null

  function bubbleContent () {
    if (!user) {
      return <Login />
    } if (chat) {
      return chat
    } else {
      return 'test'
    }
  }

  return (
    <div
      key={id}
      className='relative flex items-center justify-center w-8 h-8 border border-solid cursor-pointer'
      onClick={clickHandler}
    >
      {clickedCell === id ?
        <Bubble>
          {bubbleContent()}
        </Bubble>
        : null
      }
      {children}
    </div>
  )
}

export default Cell
