import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { NavLink, withRouter } from 'react-router-dom';

import formatPrice from '../../util/formatPrice';

import styles from './ClientList.module.scss';

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

const ClientList = ({ clients }) => (
  <nav>
    {clients && (
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            <NavLink
              to={`/client/${client.id}`}
              className={styles.clientLink}
              activeClassName={styles.clientLink__active}>
              <div className={styles.info}>
                <span className={styles.name}>{client.name}</span>
                <span>{formatPrice(client.rate)}</span>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    )}
  </nav>
);

ClientList.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      address: PropTypes.string,
      name: PropTypes.string,
      rate: PropTypes.string,
    }),
  ),
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(clientQuery),
)(ClientList);
