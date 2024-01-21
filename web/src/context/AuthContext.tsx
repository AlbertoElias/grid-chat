import React, { createContext, useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { GET_USER, ADD_USER } from '../graphql/ queries'

export interface User {
  username: string;
}

interface AuthContext {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser)
      getUser({ variables: { username: user.username } })
        .then(res => {
          if (res.data?.userByUsername) {
            console.log(res.data?.userByUsername)
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('user');
          } 
        })
    }
  }, []);

  const [addUser] = useMutation(ADD_USER)
  const [getUser] = useLazyQuery(GET_USER)

  const login = async (user: User): Promise<void> => {
    return getUser({ variables: { username: user.username } })
      .then(res => {
        console.log(res.data)
        if (!res.data?.userByUsername) {
          return addUser({ variables: { username: user.username } })
        }
        return res
      })
      .then(_ => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user))
      })
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};