import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

const mapStateToProps = state => {
  const { uid } = state.firebase.auth;
  const clients = state.firestore.ordered.userClients;

  return {
    uid,
    clients,
  };
};

/**
 * Query the "client" subcollection for the current user.
 *
 * @param {string} uid UID of the current user. This comes from the props passed to this component,
 *                      as mapped in the `mapStateToProps` function.
 *
 * @return array
 */
const clientQuery = ({ uid }) => {
  if (!uid) {
    return [];
  }
  return [
    {
      collection: 'users',
      doc: uid,
      subcollections: [{ collection: 'clients' }],
      storeAs: 'userClients',
    },
  ];
};

const ClientList = ({ clients }) => {
  return (
    <div>
      <h2>Client List</h2>
      {clients ? (
        <ul>
          {clients.map(client => (
            <li key={client.id}>{client.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

ClientList.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(clientQuery),
)(ClientList);
