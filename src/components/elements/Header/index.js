import React, { useState } from 'react';
import { useAuth } from 'hooks';
import styles from './Header.module.scss';

const Header = () => {
  const { userData, signOut } = useAuth();
  const [showUtility, setShowUtility] = useState(false);

  return (
    <header className={styles.header}>
      <button className={styles.avatar} onClick={() => setShowUtility(!showUtility)}>
        <img src={userData.picture} alt={`Avatar for user ${userData.name}`} />
      </button>

      <h3 className={styles.appname}>Taskkeeper</h3>

      {showUtility && (
        <div className={styles.utility}>
          <div className={styles.userMeta}>
            <p>
              <strong>{userData.name}</strong>
            </p>
            <p>{userData.email}</p>
          </div>
          <button onClick={signOut} className={styles.signOut}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
