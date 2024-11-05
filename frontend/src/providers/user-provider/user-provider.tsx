/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

const UserContext = createContext({
  username: '',
  userId: '',
  token: '',
  setUsername: (_name: string) => {},
  setToken: (_token: string) => {},
  setUserId: (_userId: string) => {},
})

type UserProviderProps = {
  children: ReactNode
}

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: UserProviderProps) => {
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(interceptor)
    }
  }, [token])

  return (
    <UserContext.Provider value={{ username, token, userId, setUsername, setToken, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}
