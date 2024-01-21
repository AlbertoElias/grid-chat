import { ChangeEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'

const Login = () => {
  const { login } = useAuth()
  const [inputValue, setInputValue] = useState<string>('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  const handleLogin = (ev: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    ev.stopPropagation()
    ev.preventDefault()
    if (inputValue) {
      login({
        username: inputValue
      }).catch(err => {
        console.log(err)
      })
    }
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <h2 className='text-xl sm:text-2xl text-white mb-4'>Login</h2>
      <form onSubmit={handleLogin} className='flex flex-col place-content-between w-full h-full'>
        <label
          htmlFor="username"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="text"
            id="username"
            className="w-full text-white peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Username"
            onChange={handleInputChange}
          />

          <span
            className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-green-950 p-0.5 text-xs text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
          >
            Username
          </span>
        </label>
        <Button onClick={handleLogin} disabled={!inputValue}>Login</Button>
      </form>
    </div>
  )
}

export default Login
