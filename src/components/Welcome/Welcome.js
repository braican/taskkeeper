import React from 'react';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';

import styles from './Welcome.module.scss';

const authSettings = {
  provider: 'google',
  type: 'popup',
};

const Welcome = ({ firebase }) => (
  <div className={styles.Welcome}>
    <div>
      <h1>Taskkeeper</h1>
      <div className={styles.promo}>
        <p>Keep track of your tasks and invoices.</p>
      </div>
      <button
        className="action-primary action--blue action--big"
        onClick={() => firebase.login(authSettings)}>
        Log in with Google
      </button>
    </div>
  </div>
);

Welcome.propTypes = {
  firebase: PropTypes.object,
};

export default firebaseConnect()(Welcome);
