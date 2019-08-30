import React from 'react';
import User from './User';
import Logo from '../../svg/Logo';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <Logo />
        </span>
        <span className={styles.name}>Taskkeeper</span>
      </div>

      <div className={styles.user__wrapper}>
        <User />
      </div>
    </header>
  );
};

export default Header;
