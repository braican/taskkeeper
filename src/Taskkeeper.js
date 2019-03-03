import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import AuthButton from './components/AuthButton';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

const mapStateToProps = state => ({ auth: state.firebase.auth });

const Taskkeeper = ({ auth }) => {
  if (!isLoaded(auth)) {
    return <div>Loading</div>;
  }

  return (
    <>
      <AuthButton />

      {!isEmpty(auth) ? (
        <>
          <ClientForm />
          <ClientList />
          <ClientPane />
        </>
      ) : (
        <div>Log in</div>
      )}
    </>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(Taskkeeper);
