import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isLoaded, firestoreConnect } from 'react-redux-firebase';

import { clientFilter, setupIdMap } from '../../utils';
import { invoice as invoiceStatus } from '../../utils/status';

import BackLink from '../Buttons/BackLink';
import ClientHeader from './Header';
import AddTask from '../AddTask';
import EstimatedTasks from './EstimatedTasks';
import CompletedTasks from './CompletedTasks';
import ActiveInvoices from './ActiveInvoices';
import ArchivedInvoices from './ArchivedInvoices';
import FadeIn from '../Transitions/FadeIn';

import styles from './Client.module.scss';

export const ClientContext = React.createContext();

const Client = ({
  client,
  activeInvoices,
  estimatedTasks,
  completedTasks,
  invoicedTasks,
  archivedInvoices,
  unsetInvoicing,
}) => {
  const [nextInvoiceId, setNextInvoiceId] = useState('');
  const [rate, setRate] = useState(client.rate);

  return (
    <ClientContext.Provider value={{ client, rate, setRate, nextInvoiceId, setNextInvoiceId }}>
      <div className={styles.client}>
        <BackLink className={styles.dashLink} to="/dashboard" onClick={unsetInvoicing}>
          Dashboard
        </BackLink>

        <ClientHeader />

        <FadeIn in={activeInvoices && activeInvoices.length > 0}>
          <ActiveInvoices invoices={activeInvoices} tasks={invoicedTasks} />
        </FadeIn>

        <AddTask />

        <FadeIn in={estimatedTasks !== null}>
          <EstimatedTasks tasks={estimatedTasks} />
        </FadeIn>

        <FadeIn in={completedTasks !== null}>
          <CompletedTasks tasks={completedTasks} />
        </FadeIn>

        <FadeIn in={archivedInvoices !== null}>
          <ArchivedInvoices invoices={archivedInvoices} />
        </FadeIn>
      </div>
    </ClientContext.Provider>
  );
};

Client.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  client: PropTypes.shape({
    symbol: PropTypes.string,
    name: PropTypes.string,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  activeInvoices: PropTypes.array,
  estimatedTasks: PropTypes.array,
  completedTasks: PropTypes.array,
  invoicedTasks: PropTypes.object,
  archivedInvoices: PropTypes.array,
  unsetInvoicing: PropTypes.func.isRequired,
};

Client.defaultProps = {
  activeInvoices: [],
  estimatedTasks: [],
  completedTasks: [],
  invoicedTasks: {},
  archivedInvoices: [],
};

export default compose(
  connect(
    ({ firestore, firebase: { auth } }, props) => {
      const { clientId: id } = props.match.params;
      const {
        activeInvoices: allActiveInvoices,
        estimatedTasks: allEstimated,
        completedTasks: allCompleted,
        invoicedTasks: allInvoicedTasks,
        [`${id}_invoices`]: clientInvoices,
      } = firestore.ordered;

      const client = { id, ...firestore.data.clients[id] };
      const activeInvoices = clientFilter(allActiveInvoices, id);
      const estimatedTasks = clientFilter(allEstimated, id);
      const completedTasks = clientFilter(allCompleted, id);
      const archivedInvoices = isLoaded(clientInvoices) ? clientInvoices : null;

      // Make the invoiced tasks just a map of tasks.
      const invoicedTasks = setupIdMap(clientFilter(allInvoicedTasks, id));

      return {
        auth,
        client,
        activeInvoices,
        estimatedTasks,
        completedTasks,
        invoicedTasks,
        archivedInvoices,
      };
    },
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
  firestoreConnect(({ auth, client }) => {
    if (!auth || !auth.uid) {
      return [];
    }

    return [
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'invoices',
            where: [['status', '==', invoiceStatus.FULFILLED], ['client', '==', client.id]],
            orderBy: [['fulfilledDate'], ['invoiceId']],
          },
        ],
        storeAs: `${client.id}_invoices`,
      },
    ];
  }),
)(Client);
