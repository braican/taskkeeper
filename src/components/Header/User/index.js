import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';

import FadeInUp from '../../Transitions/FadeInUp';
import styles from './User.module.scss';

const User = ({ firebase, auth, profile, removeUserRef }) => {
  const [utilsVisible, setUtilsVisibility] = useState(false);
  const utilBox = useRef();

  const clickHandler = event => {
    if (utilBox && utilBox.current && !utilBox.current.contains(event.target)) {
      setUtilsVisibility(false);
    }
  };

  useEffect(() => {
    if (utilsVisible) {
      document.addEventListener('click', clickHandler);
    }

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, [utilsVisible]);

  const logout = () => {
    setUtilsVisibility(false);
    removeUserRef();
    firebase.logout();
  };

  return (
    <div className={styles.user__wrapper}>
      {isLoaded(auth) && !isEmpty(auth) && profile.avatarUrl && (
        <>
          <button className={styles.user__avatar} onClick={() => setUtilsVisibility(!utilsVisible)}>
            <img src={profile.avatarUrl} alt={`Avatar for ${profile.displayName}`} />
          </button>

          <FadeInUp in={utilsVisible}>
            <div className={styles.utils} ref={utilBox}>
              <h6>{profile.displayName}</h6>
              <ul className={styles.util__menu}>
                <li>
                  <button className="button" onClick={logout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </FadeInUp>
        </>
      )}
    </div>
  );
};

User.propTypes = {
  firebase: PropTypes.shape({
    logout: PropTypes.func,
  }).isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
  }).isRequired,
  removeUserRef: PropTypes.func.isRequired,
};

export default compose(
  withFirebase,
  connect(
    ({ firebase: { auth, profile } }) => ({ auth, profile }),

    // Dispatch to props.
    dispatch => ({ removeUserRef: () => dispatch({ type: 'REMOVE_USER_REF' }) }),
  ),
)(User);
