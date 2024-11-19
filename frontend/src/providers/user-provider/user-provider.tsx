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
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '')

  useEffect(() => {
    if (token && username && userId) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

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

  useEffect(() => {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
  }, [username, token, userId])

  return (
    <UserContext.Provider value={{ username, token, userId, setUsername, setToken, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}
