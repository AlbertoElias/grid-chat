import { useContext } from "react";
import { ClickedCellContext } from "../context/ClickedCellContext";
import Bubble from "./Bubble";
import Login from "./Login";
import { useAuth } from "../hooks/useAuth";
import AddChat from "./AddChat";

interface CellProps {
  id: string;
  children?: React.ReactNode;
}

function Cell ({ id, children }: CellProps) {
  const { clickedCell, setClickedCell } = useContext(ClickedCellContext)
  const { user } = useAuth()
  function clickHandler (ev: React.MouseEvent<HTMLDivElement>) {
    ev.stopPropagation();
    setClickedCell(id);
  }

  const chat = true

  function bubbleContent () {
    if (!user) {
      return <Login />
    } if (chat) {
      return <AddChat id={id} />
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
