import React from 'react';
import LoginButton from 'components/elements/LoginButton';

import styles from './Welcome.module.scss';

const Welcome = () => (
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

export default Welcome;
