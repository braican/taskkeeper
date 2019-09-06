import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import FormattedPrice from '../Utils/FormattedPrice';
import BackLink from '../Buttons/BackLink';
import AddTask from '../AddTask';
import EstimatedTasks from './EstimatedTasks';
import CompletedTasks from './CompletedTasks';

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
          <EstimatedTasks tasks={estimatedTasks} />
          <CompletedTasks tasks={completedTasks} />
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
    ({ firestore }, props) => {
      const { clientId: id } = props.match.params;
      const {
        completedTasks: allCompleted,
        estimatedTasks: allEstimated,
        invoices: allInvoices,
      } = firestore.ordered;
      const client = { id, ...firestore.data.clients[id] };
      const completedTasks = allCompleted ? allCompleted.filter(task => task.client === id) : [];
      const estimatedTasks = allEstimated ? allEstimated.filter(task => task.client === id) : [];
      const invoices = allInvoices ? allInvoices.filter(invoice => invoice.client === id) : [];

      return { client, completedTasks, estimatedTasks, invoices };
    },
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
)(Client);
