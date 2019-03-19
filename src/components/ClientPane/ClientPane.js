import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';

import ClientHeader from '../ClientHeader';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';

const mapStateToProps = (state, props) => {
  if (!state.firestore.data.userClients) {
    return {};
  }

  const { clientId } = props.match.params;

  return {
    clientId,
    client: state.firestore.data.userClients[clientId],
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
// eslint-disable-next-line
const taskQuery = ({ uid, clientId }) => {
  // console.log(uid, clientId);

  // if (!props.match.params.clientId) {
  //   return [];
  // }

  return [];

  // return [
  //   {
  //     collection: 'users',
  //     doc: uid,
  //     subcollections: [
  //       {
  //         collection: 'tasks',
  //         where: [['client', '==', clientId], ['status', '==', 'active']],
  //       },
  //     ],
  //     storeAs: `${clientId}_tasks`,
  //   },
  // ];
};

const ClientPane = ({ match, client }) => {
  if (!client) {
    return null;
  }

  return (
    <ClientContext.Provider value={client}>
      <ClientHeader />
      <TaskForm clientId={match.params.clientId} />
      <TaskList clientId={match.params.clientId} />
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
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(taskQuery),
)(ClientPane);
