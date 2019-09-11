import React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';

import styles from './Welcome.module.scss';

const authSettings = {
  provider: 'google',
  type: 'popup',
};

const Welcome = ({ firebase }) => {
  const handleLogin = () => {
    firebase.login(authSettings).catch(e => console.error('Error during login: ', e));
  };

  return (
    <div className="stack">
      <p className={styles.intro}>Know what you're owe.</p>
      <button className="button" onClick={handleLogin}>
        Log in with Google
      </button>
    </div>
  );
};

Welcome.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Welcome);
