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

export const Navbar = () => {
  const { showNavbar, toggleNavbar } = useLayout()
  const { username, setToken, setUserId, setUsername } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUserId('')
    setToken('')
    setUsername('')
    toast.info('Logged out')

    navigate('/problems')
  }

  return (
    <div className={clsx(classes.navbarContainer, { [classes.hidden]: !showNavbar })}>
      <nav className={classes.navbar}>
        <section className={classes.leftSection}>
          <CodeQuestLogo />
          <a href="/problems" className={classes.navbarLinks} tabIndex={Number(showNavbar)}>Problem List</a>
        </section>
        <section className={classes.rightSection}>
          {username === '' ? (
            <a className={classes.navbarLinks} href='/sign-in' tabIndex={Number(showNavbar)}>
              <p>Sign in</p>
              <LoginIcon fontSize="large"/>
            </a>
          ) : (
            <>
              <a className={classes.navbarLinks} href="/account" tabIndex={Number(showNavbar)}>
                <p>{username}</p>
                <AccountCircleIcon fontSize="large"/>
              </a> <Seperator hasMargins/>
              <a className={classes.navbarLinks} onClick={handleLogout} tabIndex={Number(showNavbar)}>
                <p>Log out</p>
                <LogoutIcon fontSize="large"/>
              </a>
            </>
          )}
        </section>
      </nav>
      <IconButton
        onClick={toggleNavbar}
        className={clsx(classes.toggleButton, { [classes.closed]: !showNavbar })}
        aria-label={showNavbar ? 'Hide Navbar' : 'Show Navbar'}
        size='small'
      >
        {showNavbar ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </div>
  )
}
