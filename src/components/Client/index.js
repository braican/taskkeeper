import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import FormattedPrice from '../Utils/FormattedPrice';
import EstimatedTasks from './EstimatedTasks';

import styles from './Client.module.scss';

export const ClientContext = React.createContext();

const Client = ({ client, completedTasks, estimatedTasks, invoices }) => (
  <ClientContext.Provider value={{ id: client.id, completedTasks, estimatedTasks, invoices }}>
    <section className={styles.client}>
      <Link className={styles.dashLink} to="/dashboard">
        Dashboard
      </Link>

      <header>
        <h2>{client.name}</h2>
        <p>
          <FormattedPrice price={client.rate} />
        </p>
      </header>

      <div>
        <EstimatedTasks />
      </div>
    </section>
  </ClientContext.Provider>
);

Client.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  client: PropTypes.shape({
    name: PropTypes.string,
    rate: PropTypes.string,
    id: PropTypes.string,
  }),
  completedTasks: PropTypes.array,
  estimatedTasks: PropTypes.array,
  invoices: PropTypes.array,
};

export default compose(
  connect(({ firestore }, props) => {
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
  }),
)(Client);
