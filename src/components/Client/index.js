import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import { task } from '../../utils/status';

import FormattedPrice from '../Utils/FormattedPrice';
import BackLink from '../Buttons/BackLink';
import AddTask from '../AddTask';
import EstimatedTasks from './EstimatedTasks';
import CompletedTasks from './CompletedTasks';
import FadeIn from '../Transitions/FadeIn';

import styles from './Client.module.scss';

export const ClientContext = React.createContext();

const Client = ({
  client: { symbol, name, rate, id },
  completedTasks,
  estimatedTasks,
  invoices,
  unsetInvoicing,
}) => {
  const [nextInvoiceId, setNextInvoiceId] = useState('');

  return (
    <ClientContext.Provider
      value={{
        id,
        symbol,
        rate,
        invoices,
        nextInvoiceId,
        setNextInvoiceId,
      }}>
      <div className={styles.client}>
        <BackLink className={styles.dashLink} to="/dashboard" onClick={unsetInvoicing}>
          Dashboard
        </BackLink>

        <header className={styles.client__header}>
          <h2 className={styles.client__name}>{name}</h2>

          <p>
            <FormattedPrice price={rate} />
          </p>
        </header>

        <AddTask />

        <div>
          <FadeIn in={estimatedTasks !== null}>
            <EstimatedTasks tasks={estimatedTasks} />
          </FadeIn>
          <FadeIn in={completedTasks !== null}>
            <CompletedTasks tasks={completedTasks} />
          </FadeIn>
        </div>
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
    rate: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  completedTasks: PropTypes.array,
  estimatedTasks: PropTypes.array,
  invoices: PropTypes.array,
  unsetInvoicing: PropTypes.func.isRequired,
};

Client.defaultProps = {
  completedTasks: [],
  estimatedTasks: [],
  invoices: [],
};

export default compose(
  connect(
    ({ firestore, firebase: { auth } }, props) => {
      const { clientId: id } = props.match.params;
      let {
        // completedTasks: allCompleted,

        [`${id}_estimatedTasks`]: estimatedTasks,
        [`${id}_completedTasks`]: completedTasks,
        // invoices: allInvoices,
      } = firestore.ordered;
      const client = { id, ...firestore.data.clients[id] };

      // const completedTasks = allCompleted ? allCompleted.filter(task => task.client === id) : [];
      // const estimatedTasks = allEstimated ? allEstimated.filter(task => task.client === id) : [];
      // const invoices = allInvoices ? allInvoices.filter(invoice => invoice.client === id) : [];

      estimatedTasks = isLoaded(estimatedTasks) ? estimatedTasks : null;
      completedTasks = isLoaded(completedTasks) ? completedTasks : null;

      // return { client, completedTasks, estimatedTasks, invoices, auth };
      return { auth, client, estimatedTasks, completedTasks };
    },
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
  firestoreConnect(({ client: { id }, auth }) => {
    if (!auth || !auth.uid) {
      return [];
    }

    return [
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', task.ESTIMATED], ['client', '==', id]],
            orderBy: [['timestamp']],
          },
        ],
        storeAs: `${id}_estimatedTasks`,
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [
          {
            collection: 'tasks',
            where: [['status', '==', task.COMPLETED], ['client', '==', id]],
            orderBy: [['timestamp']],
          },
        ],
        storeAs: `${id}_completedTasks`,
      },
    ];
  }),
)(Client);
