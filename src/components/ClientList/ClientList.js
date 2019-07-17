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
  invoices: state.firestore.ordered.openInvoices,
  tasks: state.firestore.ordered.activeTasks,
  completed: state.firestore.ordered.completedTasks,
});

const mapDispatchToProps = dispatch => ({
  toggleSidebar: isOpen => dispatch({ type: 'TOGGLE_CLIENT_SIDEBAR', isOpen }),
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
      subcollections: [
        {
          collection: 'clients',
          orderBy: 'name',
        },
      ],
      storeAs: 'userClients',
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'invoices',
          where: [['status', '==', 'active']],
          orderBy: [['client'], ['dueDate']],
        },
      ],
      storeAs: 'openInvoices',
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['status', '==', 'estimated']],
          orderBy: [['client'], ['timestamp']],
        },
      ],
      storeAs: 'activeTasks',
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['status', '==', 'completed']],
          orderBy: [['client'], ['timestamp']],
        },
      ],
      storeAs: 'completedTasks',
    },
  ];
};

const ClientList = ({ clients, invoices, tasks, completed, toggleSidebar }) => (
  <nav>
    {clients && (
      <ul>
        {clients.map(client => {
          const clientInvoices = invoices
            ? invoices.filter(invoice => invoice.client === client.id).length > 0
            : false;
          const clientTasks = tasks
            ? tasks.filter(task => task.client === client.id).length > 0
            : false;
          const clientCompleted = completed
            ? completed.filter(task => task.client === client.id).length > 0
            : false;

          return (
            <li key={client.id}>
              <NavLink
                to={`/client/${client.id}`}
                className={styles.clientLink}
                activeClassName={styles.clientLink__active}
                onClick={() => toggleSidebar(false)}>
                {(clientInvoices || clientTasks || clientCompleted) && (
                  <div className={styles.status}>
                    {clientInvoices && <span className={styles.hasInvoice}>&nbsp;</span>}
                    {clientTasks && <span className={styles.hasTask}>&nbsp;</span>}
                    {clientCompleted && <span className={styles.hasCompleted}>&nbsp;</span>}
                  </div>
                )}
                <div className={styles.info}>
                  <span className={styles.name}>{client.name}</span>
                  <span>{formatPrice(client.rate)}</span>
                </div>
              </NavLink>
            </li>
          );
        })}
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
  invoices: PropTypes.array,
  tasks: PropTypes.array,
  completed: PropTypes.array,
  toggleSidebar: PropTypes.func,
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  firestoreConnect(clientQuery),
)(ClientList);
