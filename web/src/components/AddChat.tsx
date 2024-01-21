import { useMutation } from "@apollo/client";
import { ChangeEvent, useRef, useState } from "react";
import Button from "./Button";
import { ADD_CHAT } from "../graphql/queries";
import { useAuth } from "../hooks/useAuth";

interface AddChatProps {
  id: string;
}

function AddChat ({ id }: AddChatProps) {
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState<string>('')
  const [addChat] = useMutation(ADD_CHAT)
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  }

  const handleChatSubmit = (ev: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    ev.stopPropagation()
    ev.preventDefault()
    if (inputValue && user) {
      addChat({
        variables: {
          content: inputValue,
          author: user.id,
          id
        }
      }).then(_ => {
        setInputValue('')
        if (textareaRef.current) textareaRef.current.value = ''
      })
    }
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <h2 className='text-xl sm:text-2xl text-white mb-4'>Post</h2>
      <form
        className='flex flex-col justify-between w-full h-full'
        onSubmit={handleChatSubmit}
      >
        <textarea
          id="chat"
          className="w-full mb-2 p-2 flex-1 resize-none border-x-0 border-t-0 border-gray-200 align-top sm:text-sm"
          placeholder="Enter any additional order notes..."
          onChange={handleInputChange}
          ref={textareaRef}
        ></textarea>
        <Button onClick={handleChatSubmit} disabled={!inputValue}>Add Chat</Button>
      </form>
    </div>
  );
}

export default AddChat