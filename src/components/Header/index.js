import React from 'react';
import User from './User';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <span className={styles.brand}>Taskkeeper</span>
      <User />
    </header>
  );
};

export default Header;
