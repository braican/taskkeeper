import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';

import ClientHeader from '../ClientHeader';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';

import computeTotal from '../../util/computeTotal';

const mapStateToProps = (state, props) => {
  if (!state.firestore.data.userClients) {
    return {};
  }

  const { clientId } = props.match.params;

  return {
    uid: state.firebase.auth.uid,
    clientId,
    client: state.firestore.data.userClients[clientId],
    activeTasks: state.firestore.ordered[`${clientId}_tasks`],
  };
};

/**
 * Query the "task" subcollection for the current user.
 *
 * @param {string} uid      ID of the current user.
 * @param {string} clientId ID of the client.
 *
 * @return array
 */

const taskQuery = ({ uid, clientId }) => {
  if (!clientId || !uid) {
    return [];
  }

  return [
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['client', '==', clientId], ['status', '==', 'active']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_tasks`,
    },
  ];
};

const ClientPane = ({ match, client, activeTasks }) => {
  if (!client) {
    return null;
  }

  const activeBalance = computeTotal(activeTasks);

  return (
    <ClientContext.Provider value={{ ...client, activeBalance }}>
      <ClientHeader />
      <TaskForm clientId={match.params.clientId} />
      <TaskList tasks={activeTasks} />
    </ClientContext.Provider>
  );
};

ClientPane.propTypes = {
  // Used in `mapStateToProps` only
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }),
  }),
  client: PropTypes.shape({
    name: PropTypes.string,
  }),
  activeTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(taskQuery),
)(ClientPane);
