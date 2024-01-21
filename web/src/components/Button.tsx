import { ReactNode, MouseEventHandler } from 'react'
import cn from 'classnames'

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isPrimary?: boolean;
  disabled?: boolean;
};

function Button({ onClick, disabled, isPrimary = true, children }: ButtonProps) {
  return (
    <button
      className={cn(
        'group inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]',
        {
          'opacity-30 cursor-not-allowed': disabled,
          'hover:text-black focus:outline-none focus:ring active:text-opacity-75': !disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
      type='button'
    >
  <span
    className={cn(
        'block rounded-sm px-4 py-3 text-m font-medium group-hover:bg-transparent',
        {
          'bg-transparent text-white': isPrimary,
          'bg-white text-black': !isPrimary,
          'group-hover:bg-white group-hover:text-black': !disabled && isPrimary,
          'group-hover:bg-transparent': !disabled && !isPrimary,
        }
    )}
  >
    {children}
  </span>
</button>
  )
}

export default Button
