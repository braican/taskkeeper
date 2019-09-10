import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clientFilter } from '../../utils';

import FormattedPrice from '../Utils/FormattedPrice';
import BackLink from '../Buttons/BackLink';
import AddTask from '../AddTask';
import EstimatedTasks from './EstimatedTasks';
import CompletedTasks from './CompletedTasks';
import ActiveInvoices from './ActiveInvoices';
import FadeIn from '../Transitions/FadeIn';

import styles from './Client.module.scss';

export const ClientContext = React.createContext();

const Client = ({
  client: { symbol, name, rate, id },
  activeInvoices,
  estimatedTasks,
  completedTasks,
  invoicedTasks,
  unsetInvoicing,
}) => {
  const [nextInvoiceId, setNextInvoiceId] = useState('');

  return (
    <ClientContext.Provider
      value={{
        id,
        symbol,
        rate,
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
  activeInvoices: PropTypes.array,
  estimatedTasks: PropTypes.array,
  completedTasks: PropTypes.array,
  invoicedTasks: PropTypes.object,
  unsetInvoicing: PropTypes.func.isRequired,
};

Client.defaultProps = {
  activeInvoices: [],
  estimatedTasks: [],
  completedTasks: [],
  invoicedTasks: {},
};

export default compose(
  connect(
    ({ firestore }, props) => {
      const { clientId: id } = props.match.params;
      const {
        activeInvoices: allActiveInvoices,
        estimatedTasks: allEstimated,
        completedTasks: allCompleted,
        invoicedTasks: allInvoicedTasks,
      } = firestore.ordered;

      const client = { id, ...firestore.data.clients[id] };
      const activeInvoices = clientFilter(allActiveInvoices, id);
      const estimatedTasks = clientFilter(allEstimated, id);
      const completedTasks = clientFilter(allCompleted, id);

      // Make the invoiced tasks just a map of tasks.
      const invoicedTasks = clientFilter(allInvoicedTasks, id).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      return { client, activeInvoices, estimatedTasks, completedTasks, invoicedTasks };
    },
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
)(Client);
