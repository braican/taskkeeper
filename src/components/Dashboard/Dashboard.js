import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import Invoice from '../Invoice';

import computeTotal from '../../util/computeTotal';

import styles from './Dashboard.module.scss';

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  clients: state.firestore.ordered.userClients,
  invoices: state.firestore.ordered.openInvoices,
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
  ];
};

/**
 * Maps out an organized object containing invoices grouped by associated client.
 *
 * @param {array} clients  List of clients.
 * @param {array} invoices List of invoices.
 *
 * @return object
 */
const buildInvoiceMap = (clients, invoices) => {
  const invoiceMap = {};
  invoices.forEach(invoice => {
    const invoiceClient = invoice.client;

    if (invoiceMap[invoiceClient]) {
      invoiceMap[invoiceClient].invoices.push(invoice);
    } else {
      const foundClient = clients.find(client => client.id === invoiceClient);
      invoiceMap[invoiceClient] = {
        clientName: foundClient ? foundClient.name : invoiceClient,
        invoices: [invoice],
      };
    }
  });

  return invoiceMap;
};

const Dashboard = ({ clients, invoices }) => {
  if (!invoices || !clients) {
    return <div>Loading...</div>;
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div>
        <header>
          <p>No outstanding invoices.</p>
        </header>
      </div>
    );
  }

  const invoiceMap = buildInvoiceMap(clients, invoices);
  const billedTotal = computeTotal(invoices, true);

  return (
    <div>
      <header>
        <h1>Outstanding Invoices</h1>

        <span className={styles.billedTotal}>{billedTotal}</span>
      </header>

      <ul>
        {Object.keys(invoiceMap).map(clientId => (
          <li key={clientId} className={styles.invoiceGroup}>
            <h4>{invoiceMap[clientId].clientName}</h4>
            <ul>
              {invoiceMap[clientId].invoices.map(invoice => (
                <Invoice key={invoice.id} invoice={invoice} display="list" active />
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
  invoices: PropTypes.array,
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(invoiceQuery),
)(Dashboard);
