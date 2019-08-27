import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';

const AuthButton = ({ firebase, auth }) => {
  if (!isLoaded(auth) || isEmpty(auth)) {
    return null;
  }

  return <button onClick={firebase.logout}>Log out</button>;
};

export default compose(
  withFirebase,
  connect(({ firebase: { auth } }) => ({ auth })),
)(AuthButton);
