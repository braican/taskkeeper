import React from 'react';
import Icon from 'components/ui/Icon';
import { useAuth } from 'hooks';
import styles from './Header.module.scss';

const Header = () => {
  const { userData, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.avatar}>
        <img src={userData.picture} alt={`Avatar for user ${userData.name}`} />
      </div>

      <button onClick={signOut} className={styles.signOut}>
        <Icon label="Log out" icon="logout" viewBox="0 0 24 24" />
      </button>
    </header>
  );
};

export default Header;
