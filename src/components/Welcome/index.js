import React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';

const authSettings = {
  provider: 'google',
  type: 'popup',
};

const Welcome = ({ firebase }) => {
  return (
    <div className="stack">
      <p>You should know what you're owe.</p>
      <button className="button" onClick={() => firebase.login(authSettings)}>
        Log in
      </button>
    </div>
  );
};

Welcome.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Welcome);
