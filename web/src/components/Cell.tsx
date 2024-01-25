import React from "react";
import cn from 'classnames'

import Bubble from "./Bubble";
import Login from "./Login";
import { useAuth } from "../hooks/useAuth";
import AddChat from "./AddChat";
import { Chat } from "../context/ChatsContext";

interface CellProps {
  id: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
  clickedCell?: boolean;
  onClick: () => void;
  chat?: Chat
}

const Cell = React.memo(({ id, style, children, clickedCell, onClick, chat }: CellProps) => {
  const { user } = useAuth()

  function bubbleContent () {
    if (!user) {
      return <Login />
    } if (!chat) {
      return <AddChat id={id} />
    } else {
      return <div className="text-white">{chat.content}</div>
    }
  }

  return (
    <div
      key={id}
      className='relative flex items-center justify-center w-8 h-8 border border-solid cursor-pointer'
      onClick={onClick}
      style={style}
    >
      {clickedCell ?
        <Bubble>
          {bubbleContent()}
        </Bubble>
        : null
      }
      <div className={cn(
        "w-full h-full",
        {
          "opacity-85 bg-white": !chat
        }
      )}>{children}</div>
    </div>
  )
}, (prevProps, nextProps) => (prevProps.clickedCell === nextProps.clickedCell && prevProps.chat === nextProps.chat))

export default Cell
