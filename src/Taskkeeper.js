import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { withFirebase, isEmpty, isLoaded, firestoreConnect } from 'react-redux-firebase';

import { task, invoice } from './utils/status';

import Header from './components/Header';
import FadeInUp from './components/Transitions/FadeInUp';
import Loading from './components/Loading';

import Welcome from './views/Welcome';
import Authenticated from './views/Authenticated';

const Taskkeeper = ({ auth, profile, firestore, addUserRef }) => {
  // Add the firestore ref to the current user's collection to the store for easy access elsewhere.
  useEffect(() => {
    if (isEmpty(auth) || !auth.uid) {
      return;
    }

    addUserRef(firestore.collection('users').doc(auth.uid));
  }, [auth]);

  return (
    <div className="app">
      <FadeInUp in={isLoaded(auth) && isLoaded(profile) && isEmpty(auth)}>
        <Welcome />
      </FadeInUp>

      <FadeInUp in={isLoaded(auth) && isLoaded(profile) && !isEmpty(auth)}>
        <div>
          <Header />

          <main className="app__main">
            <Router>
              <Authenticated auth={auth} />
            </Router>
          </main>
        </div>
      </FadeInUp>

      <FadeInUp in={!isLoaded(auth) || !isLoaded(profile)}>
        <Loading />
      </FadeInUp>
    </div>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  addUserRef: PropTypes.func.isRequired,
};

export default compose(
  withFirebase,
  connect(
    // State to props.
    ({ firebase: { auth, profile }, firestore }) => ({ auth, profile, firestore }),

    // Dispatch to props.
    dispatch => ({ addUserRef: ref => dispatch({ type: 'ADD_USER_REF', ref }) }),
  ),
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
            where: [['status', '==', invoice.ACTIVE]],
            orderBy: [['client'], ['dueDate']],
          },
        ],
        storeAs: 'activeInvoices',
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', task.ESTIMATED]],
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
            where: [['status', '==', task.COMPLETED]],
            orderBy: [['client'], ['timestamp']],
          },
        ],
        storeAs: 'completedTasks',
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', task.INVOICED]],
            orderBy: [['client'], ['timestamp']],
          },
        ],
        storeAs: 'invoicedTasks',
      },
    ];
  }),
)(Taskkeeper);
