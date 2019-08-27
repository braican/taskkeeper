import React from 'react';
import AuthButton from './AuthButton';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header>
      <h1 className={styles.brand}>Taskkeeper</h1>
      <AuthButton />
    </header>
  );
};

export default Header;
