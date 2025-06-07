import { useContext } from 'react';
import { AuthenticatedUserContext } from '../context/UserContext';

export const useAuth = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  return { user, setUser };
};
