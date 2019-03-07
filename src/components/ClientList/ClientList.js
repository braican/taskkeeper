import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { NavLink, withRouter } from 'react-router-dom';

import './ClientList.scss';

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  clients: state.firestore.ordered.userClients,
});

/**
 * Query the "client" subcollection for the current user.
 *
 * @param {string} uid UID of the current user. This comes from the props passed to this component,
 *                     as mapped in the `mapStateToProps` function.
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
    <div className="ClientList">
      {clients ? (
        <ul className="list">
          {clients.map(client => (
            <li key={client.id} className="client">
              <NavLink
                to={`/client/${client.id}`}
                className="client-link"
                activeClassName="client-link--active">
                {client.name}
              </NavLink>
            </li>
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
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(clientQuery),
)(ClientList);
