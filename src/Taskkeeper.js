import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { withFirebase, isEmpty, isLoaded, firestoreConnect } from 'react-redux-firebase';

import ProtectedRoute from './components/Utils/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';

const Taskkeeper = ({ auth, profile }) => (
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
  connect(({ firebase, firestore }) => {
    const { auth, profile } = firebase;
    return { auth, profile, ...firestore.ordered };
  }),
  firestoreConnect(({ auth }) => {
    if (!auth || !auth.uid) {
      return [];
    }

    return [
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'clients',
            orderBy: 'name',
          },
        ],
        storeAs: 'clients',
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'invoices',
            where: [['status', '==', 'active']],
            orderBy: [['client'], ['dueDate']],
          },
        ],
        storeAs: 'invoices',
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', 'estimated']],
            orderBy: [['client'], ['timestamp']],
          },
        ],
        storeAs: 'estimatedTasks',
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', 'completed']],
            orderBy: [['client'], ['timestamp']],
          },
        ],
        storeAs: 'completedTasks',
      },
    ];
  }),
)(Taskkeeper);
