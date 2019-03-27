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
    estimatedTasks: state.firestore.ordered[`${clientId}_estimated_tasks`],
    completedTasks: state.firestore.ordered[`${clientId}_completed_tasks`],
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
          where: [['client', '==', clientId], ['status', '==', 'estimated']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_estimated_tasks`,
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['client', '==', clientId], ['status', '==', 'completed']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_completed_tasks`,
    },
  ];
};

const ClientPane = ({ match, client, estimatedTasks, completedTasks }) => {
  if (!client) {
    return null;
  }

  const estimatedBalance = computeTotal(estimatedTasks);
  const completedBalance = computeTotal(completedTasks);

  return (
    <ClientContext.Provider value={{ ...client, estimatedBalance }}>
      <ClientHeader />
      <TaskForm clientId={match.params.clientId} />
      <TaskList tasks={estimatedTasks} header="Estimated Tasks" taskBalance={estimatedBalance} />
      <TaskList tasks={completedTasks} header="Completed Tasks" taskBalance={completedBalance} />
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
  estimatedTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  completedTasks: PropTypes.arrayOf(
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
