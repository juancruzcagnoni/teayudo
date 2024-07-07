import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments as farComments, faUser as farUser, faSmile as farSmile } from '@fortawesome/free-regular-svg-icons';
import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/">
            <FontAwesomeIcon icon={farComments} className={styles.icon} />
            <span>Comunicar</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/meditacion">
            <FontAwesomeIcon icon={farSmile} className={styles.icon} />
            <span>Meditación</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/perfil">
            <FontAwesomeIcon icon={farUser} className={styles.icon} />
            <span>Perfil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
