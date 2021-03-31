import React, { useState } from 'react';
import Button from '../Button';
import { useAuth } from '../../contexts/auth';
import styles from './Header.module.scss';

const Header = () => {
  const { userData, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const timeGreeting = () => {
    const d = new Date();
    const hours = d.getHours();

    if (hours < 11) {
      return 'Good morning';
    }

    if (hours < 16) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <img src={userData.picture} alt={`Avatar for user ${userData.name}`} />
        </div>

        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <>&times;</>
          ) : (
            <>
              <span></span>
              <span></span>
              <span></span>
            </>
          )}
        </button>
      </header>
      <aside className={`${styles.utilMenu} ${menuOpen ? styles.utilMenuOpen : ''}`}>
        <p>
          {timeGreeting()} {userData.firstName}!
        </p>
        <Button onClick={signOut} text="Log out" />
      </aside>
    </>
  );
};

export default Header;
