import { createContext, useEffect, useState } from "react";
import { User } from "./AuthContext";
import { useMutation, useQuery, SubscribeToMoreOptions } from "@apollo/client";
import { ADD_CHAT, GET_CHATS } from "../graphql/queries";

export interface Chat {
  id: string;
  content: string;
  createdAt?: string;
  author: User;
}

interface ChatsContext {
  chats: Map<string, Chat>;
  addChat: (chat: Chat) => Promise<void>;
  subscribeToMore: (options: SubscribeToMoreOptions<any, any, any>) => () => void;
}

export const ChatsContext = createContext<ChatsContext | null>(null);

export const ChatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState(new Map<string, Chat>());
  const { data, subscribeToMore } = useQuery(GET_CHATS)
  const [addChat] = useMutation(ADD_CHAT)

  useEffect(() => {
    if (!data) return
    const chatsMap = new Map()
    data.chats.forEach((chat: Chat) => {
      chatsMap.set(chat.id, chat)
    })
    setChats(chatsMap)
  }, [data])

  const storeChat = async (chat: Chat): Promise<void> => {
    return addChat({
      variables: {
        content: chat.content,
        author: chat.author.id,
        id: chat.id
      }
    }).then(_ => {
      return setChats(prevChats => {
        const newChats = new Map(prevChats);
        newChats.set(chat.id, chat);
        return newChats;
      });
    })
  };

  return (
    <ChatsContext.Provider value={{ chats, addChat: storeChat, subscribeToMore }}>
      {children}
    </ChatsContext.Provider>
  );
}