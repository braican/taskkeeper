import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import User from '../User';

import './Auth.scss';

const mapStateToProps = state => ({ auth: state.firebase.auth });

const Auth = ({ auth, firebase }) => {
  const authSettings = {
    provider: 'google',
    type: 'popup',
  };

  if (!isLoaded(auth)) {
    return null;
  }

  if (isEmpty(auth)) {
    return (
      <div className="Auth">
        <button onClick={() => firebase.login(authSettings)}>Log in with Google</button>
      </div>
    );
  }

  return (
    <div className="Auth">
      <button className="action-secondary logout" onClick={() => firebase.logout()}>
        Logout
      </button>
      <User name={auth.displayName} avatar={auth.photoURL} />
    </div>
  );
};

Auth.propTypes = {
  auth: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  firebase: PropTypes.object,
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(Auth);
