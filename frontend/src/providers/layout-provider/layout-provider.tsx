import { createContext, ReactNode, useContext, useState } from 'react'

const LayoutContext = createContext({
  showNavbar: true,
  toggleNavbar: () => {}
})

type LayoutProviderProps = {
    children: ReactNode
}

export const useLayout = () => useContext(LayoutContext)

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [showNavbar, setShowNavbar] = useState(true)

  const toggleNavbar = () => setShowNavbar((prev) => !prev)

  return (
    <LayoutContext.Provider value={{ showNavbar, toggleNavbar }}>
      {children}
    </LayoutContext.Provider>
  )
}
