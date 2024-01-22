import { createContext, useEffect, useState } from "react";
import { User } from "./AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CHATS } from "../graphql/queries";

export interface Chat {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface ChatsContext {
  chats: Map<string, Chat>;
  addChat: (chat: Chat) => void;
}

export const ChatsContext = createContext<ChatsContext | null>(null);

export const ChatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState(new Map<string, Chat>());
  const { data } = useQuery(GET_CHATS)

  useEffect(() => {
    if (!data) return
    const chatsMap = new Map()
    data.chats.forEach((chat: Chat) => {
      chatsMap.set(chat.id, chat)
    })
    console.log(chatsMap)
    setChats(chatsMap)
  }, [data])

  const addChat = (chat: Chat) => {
    setChats(prevChats => {
      const newChats = new Map(prevChats);
      newChats.set(chat.id, chat);
      return newChats;
    });
  };

  return (
    <ChatsContext.Provider value={{ chats, addChat }}>
      {children}
    </ChatsContext.Provider>
  );
}