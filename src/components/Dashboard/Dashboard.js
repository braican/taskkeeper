import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';

import Invoice from '../Invoice';

import computeTotal from '../../util/computeTotal';

import RightArrow from '../../svg/arrow-right';
import styles from './Dashboard.module.scss';

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  clients: state.firestore.ordered.userClients,
  invoices: state.firestore.ordered.openInvoices,
  tasks: state.firestore.ordered.activeTasks,
});

/**
 * Query the "client" subcollection for the current user.
 *
 * @param {string} uid UID of the current user. This comes from the props passed to this component,
 *                     as mapped in the `mapStateToProps` function.
 *
 * @return array
 */
const invoiceQuery = ({ uid }) => {
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
  ];
};

/**
 * Maps out an organized object containing invoices and tasks grouped by associated client.
 *
 * @param {array} clients  List of clients.
 * @param {array} invoices List of invoices.
 * @param {array} tasks    List of tasks.
 *
 * @return object
 */
const buildClientMap = (clients, invoices, tasks) => {
  const map = {};
  invoices.forEach(invoice => {
    const invoiceClient = invoice.client;

    if (map[invoiceClient]) {
      map[invoiceClient].invoices.push(invoice);
    } else {
      const foundClient = clients.find(client => client.id === invoiceClient);
      map[invoiceClient] = {
        clientName: foundClient ? foundClient.name : invoiceClient,
        invoices: [invoice],
        tasks: [],
      };
    }
  });

  tasks.forEach(task => {
    const taskClient = task.client;

    if (map[taskClient]) {
      map[taskClient].tasks.push(task);
    } else {
      const foundClient = clients.find(client => client.id === taskClient);
      map[taskClient] = {
        clientName: foundClient ? foundClient.name : taskClient,
        invoices: [],
        tasks: [task],
      };
    }
  });

  return map;
};

const Dashboard = ({ clients, invoices, tasks }) => {
  if (!invoices || !clients || !tasks) {
    return <div>Loading...</div>;
  }

  invoices = invoices || [];
  tasks = tasks || [];

  const clientMap = buildClientMap(clients, invoices, tasks);
  const billedTotal = computeTotal(invoices, true);

  return (
    <div>
      <section className={`app-section ${styles.section}`}>
        {invoices.length > 0 ? (
          <>
            <header>
              <h2>Outstanding Invoices</h2>

              <span className={styles.billedTotal}>{billedTotal}</span>
            </header>

            <ul>
              {Object.keys(clientMap).map(clientId => {
                if (clientMap[clientId].invoices.length === 0) {
                  return null;
                }

                return (
                  <li key={clientId} className={styles.invoiceGroup}>
                    <h5>{clientMap[clientId].clientName}</h5>
                    <ul>
                      {clientMap[clientId].invoices.map(invoice => (
                        <Invoice key={invoice.id} invoice={invoice} display="list" active />
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>No outstanding invoices</p>
        )}
      </section>

      <section className={`app-section ${styles.section}`}>
        {tasks.length > 0 ? (
          <>
            <header>
              <h2>Open Tasks</h2>
            </header>

            <ul className={styles.openTasks}>
              {Object.keys(clientMap).map(clientId => {
                const taskCount = clientMap[clientId].tasks.length;

                if (taskCount === 0) {
                  return null;
                }

                return (
                  <li key={clientId} className={styles.taskGroup}>
                    <h5>{clientMap[clientId].clientName}</h5>
                    <p>
                      {taskCount} open task{taskCount > 1 ? 's' : ''}
                    </p>

                    <NavLink to={`/client/${clientId}`} className={styles.linkToClient}>
                      <span>To client</span>
                      <RightArrow />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>Great job, you have no open tasks!</p>
        )}
      </section>
    </div>
  );
};

Dashboard.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      address: PropTypes.string,
      name: PropTypes.string,
      rate: PropTypes.string,
    }),
  ),
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string,
      dueDate: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      id: PropTypes.string,
      invoiceId: PropTypes.string,
      issueDate: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      projectDescription: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.string),
      timestamp: PropTypes.number,
    }),
  ),
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      id: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
      timestamp: PropTypes.number,
    }),
  ),
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(invoiceQuery),
)(Dashboard);
