import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClientContext from '../../contexts/ClientContext';

import TaskForm from '../TaskForm';
import TaskList from '../TaskList';

const mapStateToProps = (state, props) => {
  if (!state.firestore.data.userClients) {
    return {};
  }

  const { clientId } = props.match.params;

  return {
    client: state.firestore.data.userClients[clientId],
  };
};

const ClientPane = ({ match, client }) => {
  if (!client) {
    return null;
  }

  return (
    <ClientContext.Provider value={client}>
      <h1>{client.name}</h1>
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

export default connect(mapStateToProps)(ClientPane);
