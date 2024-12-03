/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Problem } from '../../types'
import SessionTimeoutModal from './time-out-modal'

const UserContext = createContext({
  username: '',
  userId: '',
  token: '',
  isAdmin: false,
  refreshToken: '',
  userProblem: undefined as Problem | undefined,
  darkMode: false,
  setUsername: (_name: string) => {},
  setToken: (_token: string) => {},
  setUserId: (_userId: string) => {},
  setIsAdmin: (_isAdmin: boolean) => {},
  setRefreshToken: (_refreshToken: string) => {},
  setUserProblem: (_userProblem: Problem | undefined) => {},
  setDarkMode: (_darkMode: boolean) => {},
})

type UserProviderProps = {
  children: ReactNode;
};

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: UserProviderProps) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '')
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true')
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '')
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
  const [userProblem, setUserProblem] = useState<Problem | undefined>(() => {
    const savedProblem = localStorage.getItem('userProblem')
    return savedProblem ? JSON.parse(savedProblem) : undefined
  })
  const [isSessionTimeoutModalOpen, setIsSessionTimeoutModalOpen] = useState(false)

  useEffect(() => {
    if (token && username && userId) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (config.url === 'http://localhost:8080/auth/refresh-token') {
          delete config.headers['Authorization']
        } else if (token) {
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
          setIsSessionTimeoutModalOpen(true)
          try {
            const refreshResponse = await axios.post(
              'http://localhost:8080/auth/refresh-token',
              { refreshToken }
            )

            if (refreshResponse.data) {
              setToken(refreshResponse.data.access_token)
              setRefreshToken(refreshResponse.data.refresh_token)
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError)
            setUserId('')
            setToken('')
            setUsername('')
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
    localStorage.setItem('darkMode', darkMode.toString())
    if (userProblem) {
      localStorage.setItem('userProblem', JSON.stringify(userProblem))
    } else {
      localStorage.removeItem('userProblem')
    }
  }, [username, token, userId, isAdmin, refreshToken, userProblem, darkMode])

  return (
    <UserContext.Provider
      value={{
        username,
        token,
        userId,
        refreshToken,
        userProblem,
        darkMode,
        setUsername,
        setToken,
        setUserId,
        isAdmin,
        setIsAdmin,
        setRefreshToken,
        setUserProblem,
        setDarkMode,
      }}
    >
      {children}
      <SessionTimeoutModal
        open={isSessionTimeoutModalOpen}
        onClose={() => {
          setIsSessionTimeoutModalOpen(false)
          window.location.reload()
        }}
      />
    </UserContext.Provider>
  )
}
