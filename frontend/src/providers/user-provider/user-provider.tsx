/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

const UserContext = createContext({
  username: '',
  userId: '',
  token: '',
  isAdmin: false,
  refreshToken: '',
  setUsername: (_name: string) => {},
  setToken: (_token: string) => {},
  setUserId: (_userId: string) => {},
  setIsAdmin: (_isAdmin: boolean) => {},
  setRefreshToken: (_refreshToken: string) => {},
})

type UserProviderProps = {
  children: ReactNode
}

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: UserProviderProps) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '')
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true')
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '')

  useEffect(() => {
    if (token && username && userId) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const requestInterceptor = axios.interceptors.request.use(
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

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response
      },
      async(error) => {
        if (error.response?.status === 500 && error.response?.data?.message?.includes('The Token has expired')) {
          try {
            const axiosInstance = axios.create()
            const refreshResponse = await axiosInstance.post('http://localhost:8080/auth/refresh-token', { refreshToken })

            if (refreshResponse.data) {
              setToken(refreshResponse.data.access_token)
              setRefreshToken(refreshResponse.data.refresh_token)
              window.location.reload()
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [token])

  useEffect(() => {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('isAdmin', isAdmin.toString())
    localStorage.setItem('refreshToken', refreshToken)
  }, [username, token, userId, isAdmin])

  return (
    <UserContext.Provider value={{
      username,
      token,
      userId,
      refreshToken,
      setUsername,
      setToken,
      setUserId,
      isAdmin,
      setIsAdmin,
      setRefreshToken,
    }}>
      {children}
    </UserContext.Provider>
  )
}
