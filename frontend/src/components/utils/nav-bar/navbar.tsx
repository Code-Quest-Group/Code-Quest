import clsx from 'clsx'
import { CodeQuestLogo } from '../logo'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton } from '@mui/material'
import { useLayout } from '../../../providers'
import { Seperator } from '../seperator'
import classes from './navbar.module.scss'

export const Navbar = () => {
  const { showNavbar, toggleNavbar } = useLayout()

  return (
    <div className={clsx(classes.navbarContainer, { [classes.hidden]: !showNavbar })}>
      <nav className={classes.navbar}>
        <section className={classes.leftSection}>
          <CodeQuestLogo />
          <a href="/problems" className={classes.navbarLinks} tabIndex={Number(showNavbar)}>Problem List</a>
        </section>
        <section className={classes.rightSection}>
          <a className={classes.navbarLinks} href='/settings' tabIndex={Number(showNavbar)}>
            <p>Settings</p>
            <SettingsIcon fontSize="large"/>
          </a>
          <Seperator hasMargins/>
          <a className={classes.navbarLinks} href="/account" tabIndex={Number(showNavbar)}>
            <p>Username</p>
            <AccountCircleIcon fontSize="large"/>
          </a>
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
