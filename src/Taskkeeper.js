import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';

import ProtectedRoute from './components/Utils/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';

const Taskkeeper = ({ auth, profile }) => {
  return (
    <div className="app">
      <Header />

      <main className="app__main">
        {isLoaded(auth) && isLoaded(profile) ? (
          <Router>
            <ProtectedRoute
              path="/"
              exact
              component={Welcome}
              condition={isEmpty(auth)}
              redirect="/dashboard"
            />
            <ProtectedRoute
              path="/dashboard"
              component={Dashboard}
              condition={!isEmpty(auth)}
              redirect="/"
            />
          </Router>
        ) : (
          <h2>Loading...</h2>
        )}
      </main>
    </div>
  );
};

Taskkeeper.defaultProps = {
  auth: null,
  profile: null,
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
  profile: PropTypes.object,
};

export default compose(
  withFirebase,
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(Taskkeeper);
