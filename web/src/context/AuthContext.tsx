import React, { createContext, useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { GET_USER, ADD_USER } from '../graphql/queries'

export interface User {
  username: string;
  id?: string;
  __typename?: string;
}

interface AuthContext {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      getUser({ variables: { username: parsedUser.username } })
        .then(res => {
          const resUser = res.data?.userByUsername
          if (resUser) {
            setUser({
              username: resUser.username,
              id: resUser.id
            })
          } else {
            localStorage.removeItem('user');
          }
        })
    }
  }, []);

  const [addUser] = useMutation(ADD_USER)
  const [getUser] = useLazyQuery(GET_USER)

  const login = async (userData: User): Promise<void> => {
    return getUser({ variables: { username: userData.username } })
      .then(res => {
        if (!res.data?.userByUsername) {
          return addUser({ variables: { username: userData.username } })
        }
        return res
      })
      .then(res => {
        setUser({
          username: res.data?.userByUsername.username,
          id: res.data?.userByUsername.id
        });
        localStorage.setItem('user', JSON.stringify(userData))
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
