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

const Taskkeeper = ({ auth }) => {
  return (
    <div>
      <Header />
      {isLoaded(auth) ? (
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
        <h2>loading...</h2>
      )}
    </div>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
};

export default compose(
  withFirebase,
  connect(({ firebase: { auth } }) => ({ auth })),
)(Taskkeeper);
