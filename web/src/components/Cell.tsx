import Bubble from "./Bubble";
import Login from "./Login";
import { useAuth } from "../hooks/useAuth";
import AddChat from "./AddChat";
import React from "react";

interface CellProps {
  id: string;
  children?: React.ReactNode;
  clickedCell?: boolean;
  onClick: (id: string) => void;
}

const Cell = React.memo(({ id, children, clickedCell, onClick }: CellProps) => {
  const { user } = useAuth()
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

  function clickHandler (ev: React.MouseEvent<HTMLDivElement>) {
    ev.stopPropagation()
    onClick(id)
  }

  return (
    <div
      key={id}
      className='relative flex items-center justify-center w-8 h-8 border border-solid cursor-pointer'
      onClick={clickHandler}
    >
      {clickedCell ?
        <Bubble>
          {bubbleContent()}
        </Bubble>
        : null
      }
      {children}
    </div>
  )
}, (prevProps, nextProps) => (prevProps.clickedCell === nextProps.clickedCell))

export default Cell
