import { useContext } from 'react';
import { ChatsContext } from '../context/ChatsContext';

export const useChats = () => {
  const context = useContext(ChatsContext);
  if (!context) {
    throw new Error('useChats must be used within an ChatsProvider');
  }
  return context;
}