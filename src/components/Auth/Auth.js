import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import User from '../User';

import Exit from '../../svg/exit';
import './Auth.scss';

const mapStateToProps = state => ({ auth: state.firebase.auth });

const mapDispatchToProps = dispatch => ({
  addClientRef: ref => dispatch({ type: 'ADD_CLIENT_REF', ref }),
  addTaskRef: ref => dispatch({ type: 'ADD_TASK_REF', ref }),
  addInvoiceRef: ref => dispatch({ type: 'ADD_INVOICE_REF', ref }),
});

const Auth = ({ logout, auth, firestore, addClientRef, addTaskRef, addInvoiceRef }) => {
  if (!isLoaded(auth) || isEmpty(auth)) {
    return null;
  }

  useEffect(() => {
    if (firestore.collection && auth.uid) {
      const userRef = firestore.collection('users').doc(auth.uid);
      addClientRef(userRef.collection('clients'));
      addTaskRef(userRef.collection('tasks'));
      addInvoiceRef(userRef.collection('invoices'));
    }
  }, []);

  return (
    <div className="Auth">
      <div>
        <button className="action-secondary action-has-icon logout" onClick={logout}>
          <span className="action-word">Logout</span>
          <Exit />
        </button>
      </div>
      <User name={auth.displayName} avatar={auth.photoURL} />
    </div>
  );
};

Auth.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  firebase: PropTypes.object,
  firestore: PropTypes.object,
  addClientRef: PropTypes.func,
  addTaskRef: PropTypes.func,
  addInvoiceRef: PropTypes.func,
};

export default compose(
  firestoreConnect(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Auth);
