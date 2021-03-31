import React from 'react';
import LoginButton from '../../components/LoginButton';

import styles from './Anonymous.module.scss';

const Anonymous = () => (
  <div className={styles.screen}>
    <main className={styles.main}>
      <h1 className={styles.title}>Taskkeeper</h1>
      <h2>Know what you're owe, and track tasks.</h2>

      <LoginButton className={styles.loginButton} />
    </main>

    <footer className={styles.footer}>
      &copy;{' '}
      <a href="https://braican.com" target="_blank" rel="noreferrer noopener">
        Nick Braica
      </a>
    </footer>
  </div>
);

export default Anonymous;
