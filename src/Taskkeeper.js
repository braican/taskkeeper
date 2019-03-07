import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import { BrowserRouter, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

const mapStateToProps = state => ({ auth: state.firebase.auth });

const Taskkeeper = ({ auth }) => {
  if (!isLoaded(auth)) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <>
        <Auth />

        {!isEmpty(auth) ? (
          <>
            <ClientForm />
            <ClientList />
            <Route path="/" exact component={Dashboard} />
            <Route path="/client/:clientId" component={ClientPane} />
          </>
        ) : (
          <div>Log in</div>
        )}
      </>
    </BrowserRouter>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(Taskkeeper);
