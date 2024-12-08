import clsx from 'clsx'
import { CodeQuestLogo } from '../logo'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUser } from '../../../providers'
import { Seperator } from '../seperator'
import classes from './navbar.module.scss'
import { lazy, Suspense, useState } from 'react'

const SignInModal = lazy(() => import('../../views/sign-in/sign-in'))

export const Navbar = () => {
  const { username, setToken, setUserId, setUsername, userId, setIsAdmin } = useUser()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleLogout = () => {
    setUserId('')
    setToken('')
    setUsername('')
    setIsAdmin(false)
    toast.info('Logged out')

    navigate('/')
    window.location.reload()
  }

  return (
    <>
      <div className={clsx(classes.navbarContainer)}>
        <nav className={classes.navbar}>
          <section>
            <CodeQuestLogo />
            <button
              onClick={() => navigate('/')}
              className={classes.navbarLinks}
              aria-label='Problem List'
            >
              Problem List
            </button>
          </section>
          <section>
            {username === '' ? (
              <button
                className={classes.navbarLinks}
                onClick={handleOpenModal}
                aria-label='Sign in'
              >
                <p>Sign in</p>
                <LoginIcon fontSize="large"/>
              </button>
            ) : (
              <>
                <button
                  className={classes.navbarLinks}
                  onClick={() => navigate(`/account/${userId}`)}
                  aria-label='account'
                >
                  <p>{username}</p>
                  <AccountCircleIcon fontSize="large"/>
                </button>
                <Seperator hasMargins/>
                <button
                  className={classes.navbarLinks}
                  onClick={handleLogout}
                  aria-label='Log out'
                >
                  <p>Log out</p>
                  <LogoutIcon fontSize="large"/>
                </button>
              </>
            )}
          </section>
        </nav>
      </div>
      <Suspense>
        {isModalOpen && <SignInModal open={isModalOpen} onClose={handleCloseModal} />}
      </Suspense>
    </>
  )
}
