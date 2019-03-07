import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  if (!state.firestore.data.userClients) {
    return {};
  }

  const { clientId } = props.match.params;

  return {
    client: state.firestore.data.userClients[clientId],
  };
};

const ClientPane = ({ client }) => {
  if (!client) {
    return null;
  }

  return (
    <div>
      <p>{client.name}</p>
    </div>
  );
};

ClientPane.propTypes = {
  // Used in `mapStateToProps` only
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
  }),
  client: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default connect(mapStateToProps)(ClientPane);
