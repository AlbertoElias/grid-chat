import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const LogoutButton = () => {
  const { logout } = useAuth();

  return <Button onClick={logout} isPrimary={false}>Logout</Button>;
};

export default LogoutButton;