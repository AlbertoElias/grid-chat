import { ChangeEvent, useRef, useState } from "react";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";
import { useChats } from "../hooks/useChats";

interface AddChatProps {
  id: string;
}

function AddChat ({ id }: AddChatProps) {
  const { user } = useAuth()
  const { addChat } = useChats();
  const [inputValue, setInputValue] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  }

  const handleChatSubmit = (ev: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    ev.stopPropagation()
    ev.preventDefault()
    if (inputValue && user) {
      addChat({
        content: inputValue,
        author: user,
        id
      }).then((_: any) => {
        setInputValue('')
        if (textareaRef.current) textareaRef.current.value = ''
      })
    }
  }

  return (
    <form
      className='flex flex-col justify-between w-full h-full'
      onSubmit={handleChatSubmit}
    >
      <textarea
        id="chat"
        className="w-full mb-2 p-2 flex-1 resize-none bg-transparent placeholder-gray-200 text-white border-gray-200 rounded-md align-top sm:text-sm focus-within:border-teal-300 focus-within:ring-1 focus-within:ring-teal-300"
        placeholder="Write a message..."
        onChange={handleInputChange}
        ref={textareaRef}
      ></textarea>
      <Button onClick={handleChatSubmit} disabled={!inputValue}>Add Chat Here</Button>
    </form>
  );
}

export default AddChat