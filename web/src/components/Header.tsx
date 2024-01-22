import LogoutButton from './LogoutButton';
import { useAuth } from '../hooks/useAuth';

function Header () {
  const { user } = useAuth();
  return (
    <header className='flex items-center justify-between w-full h-16 px-4 bg-teal-600'>
      <h1 className='text-3xl text-white'>Grid Chat</h1>
      {user ? <LogoutButton /> : null}
    </header>
  );
}

export default Header;