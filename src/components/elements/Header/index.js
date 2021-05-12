import React, { useState } from 'react';
import classnames from 'classnames';
import Icon from 'components/ui/Icon';
import { useAuth } from 'hooks';
import styles from './Header.module.scss';

const Header = () => {
  const { userData, signOut } = useAuth();
  const [showUtil, setShowUtil] = useState(false);

  return (
    <header className={classnames(styles.header, showUtil && styles.headerWithUtil)}>
      <button className={styles.avatar} onClick={() => setShowUtil(!showUtil)}>
        <img src={userData.picture} alt={`Avatar for user ${userData.name}`} />
      </button>

      {showUtil && (
        <button onClick={signOut} className={styles.signOut}>
          <Icon label="Log out" icon="logout" viewBox="0 0 24 24" />
        </button>
      )}
    </header>
  );
};

export default Header;
