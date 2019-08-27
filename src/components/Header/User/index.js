import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import { CSSTransition } from 'react-transition-group';

import styles from './User.module.scss';

const User = ({ firebase, auth, profile }) => {
  const [utilsVisible, setUtilsVisibility] = useState(false);

  return (
    <div className={styles.user__wrapper}>
      {isLoaded(auth) && !isEmpty(auth) && profile.avatarUrl && (
        <>
          <button className={styles.user__avatar} onClick={() => setUtilsVisibility(!utilsVisible)}>
            <img src={profile.avatarUrl} alt={`Avatar for ${profile.displayName}`} />
          </button>

          <CSSTransition
            in={utilsVisible}
            timeout={200}
            classNames={{
              enter: styles.utilsEnter,
              enterActive: styles.utilsEnterActive,
              enterDone: styles.utilsEnterDone,
              exit: styles.utilsExit,
              exitActive: styles.utilsExitActive,
            }}
            unmountOnExit>
            <div className={styles.utils}>
              <h6>{profile.displayName}</h6>
              <ul className={styles.util__menu}>
                <li>
                  <button className="button" onClick={firebase.logout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </CSSTransition>
        </>
      )}
    </div>
  );
};

User.defaultProps = {
  auth: null,
  profile: null,
};

User.propTypes = {
  firebase: PropTypes.shape({
    logout: PropTypes.func,
  }).isRequired,
  auth: PropTypes.object,
  profile: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
  }),
};

export default compose(
  withFirebase,
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(User);
