import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';

const mapStateToProps = state => ({ auth: state.firebase.auth });

const AuthButton = ({ auth, firebase }) => {
  const authSettings = {
    provider: 'google',
    type: 'popup',
  };

  if (!isLoaded(auth)) {
    return null;
  }

  if (isEmpty(auth)) {
    return (
      <div>
        <button onClick={() => firebase.login(authSettings)}>Log in with Google</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => firebase.logout()}>Logout</button>
      <p>{auth.displayName}</p>
    </div>
  );
};

AuthButton.propTypes = {
  auth: PropTypes.object,
  firebase: PropTypes.object,
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(AuthButton);
