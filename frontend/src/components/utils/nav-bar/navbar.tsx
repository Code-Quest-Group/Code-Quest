import clsx from 'clsx';
import { useState } from 'react';
import { CodeQuestLogo } from '../logo';

import { useNavigate } from 'react-router-dom';
import classes from './navbar.module.scss';

export const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true)
  const navigate = useNavigate();

  

  return (
    <div className={classes.navbarContainer}>
      <nav className={clsx(classes.navbar, { ['hidden']: !showNavbar })}>
        <section className={classes.leftSection}>
          <CodeQuestLogo />
          <a onClick={() => navigate('/problems')} className={classes.navbarLinks}>Problem List</a>
        </section>
        <section className={classes.rightSection}>
          <a className={classes.navbarLinks}>Settings</a>
          {/* Seperator will be here */}
          <a className={classes.navbarLinks}>Username</a>
        </section>
        {/* Button will be here (to hide and show navbar */}
      </nav>
    </div>
  )
}
