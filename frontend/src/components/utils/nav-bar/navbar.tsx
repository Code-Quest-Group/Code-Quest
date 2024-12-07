import clsx from 'clsx'
import { CodeQuestLogo } from '../logo'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLayout, useUser } from '../../../providers'
import { Seperator } from '../seperator'
import classes from './navbar.module.scss'
import { lazy, Suspense, useEffect, useState } from 'react'

const SignInModal = lazy(() => import('../../views/sign-in/sign-in'))

export const Navbar = () => {
  const { showNavbar, toggleNavbar } = useLayout()
  const { username, setToken, setUserId, setUsername, userId, setIsAdmin } = useUser()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFirefox, setIsFirefox] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleLogout = () => {
    setUserId('')
    setToken('')
    setUsername('')
    setIsAdmin(false)
    toast.info('Logged out')

    navigate('/problems')
    window.location.reload()
  }

  const tabIndex = showNavbar ? 0 : -1

  useEffect(() => {
    const isUsingFirefox = navigator.userAgent.toLowerCase().includes('firefox')
    setIsFirefox(isUsingFirefox)
  }, [])

  return (
    <>
      <div className={clsx(classes.navbarContainer, { [classes.hidden]: !showNavbar })}>
        <nav className={classes.navbar}>
          <section>
            <CodeQuestLogo />
            <a
              href="/problems"
              className={classes.navbarLinks}
              tabIndex={tabIndex}
              aria-label='Problem List'
            >
              Problem List
            </a>
          </section>
          <section>
            {username === '' ? (
              <button
                className={classes.navbarLinks}
                tabIndex={tabIndex}
                onClick={handleOpenModal}
                aria-label='Sign in'
              >
                <p>Sign in</p>
                <LoginIcon fontSize="large"/>
              </button>
            ) : (
              <>
                <a
                  className={classes.navbarLinks}
                  href={`/account/${userId}`}
                  tabIndex={tabIndex}
                  aria-label='account'
                >
                  <p>{username}</p>
                  <AccountCircleIcon fontSize="large"/>
                </a>
                <Seperator hasMargins/>
                <button
                  className={classes.navbarLinks}
                  onClick={handleLogout}
                  tabIndex={tabIndex}
                  aria-label='Log out'
                >
                  <p>Log out</p>
                  <LogoutIcon fontSize="large"/>
                </button>
              </>
            )}
          </section>
        </nav>
        <IconButton
          onClick={toggleNavbar}
          className={clsx(
            classes.toggleButton,
            {
              [classes.closed]: !showNavbar,
              ['hidden']: isFirefox,
            }
          )}
          aria-label={showNavbar ? 'Hide Navbar' : 'Show Navbar'}
          size='small'
        >
          {showNavbar ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </div>
      <Suspense>
        {isModalOpen && <SignInModal open={isModalOpen} onClose={handleCloseModal} />}
      </Suspense>
    </>
  )
}
