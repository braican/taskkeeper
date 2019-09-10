import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { clientFilter, className } from '../../utils';

import styles from './ClientList.module.scss';

const ClientList = ({ clients, estimatedTasks, completedTasks, activeInvoices }) => (
  <section>
    {clients && clients.length > 0 ? (
      <ul>
        {clients.map(client => {
          const tasks =
            clientFilter(estimatedTasks, client.id).length +
            clientFilter(completedTasks, client.id).length;
          const actives = clientFilter(activeInvoices, client.id).length;

          return (
            <li
              key={client.id}
              {...className(styles.client, (tasks > 0 || actives > 0) && styles.clientHasActivity)}>
              <Link className={styles.client__link} to={`/client/${client.id}`}>
                <span>{client.name}</span>
              </Link>

              {tasks > 0 || actives > 0 ? (
                <div className={styles.taskStatus}>
                  {tasks > 0 && (
                    <span>
                      {tasks} task{tasks === 1 ? '' : 's'}
                    </span>
                  )}
                  {actives > 0 && (
                    <span className={styles.activeInvoices}>
                      {actives} active invoice{actives === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    ) : (
      <p>You haven't added any clients.</p>
    )}
  </section>
);

ClientList.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  ),
  estimatedTasks: PropTypes.array,
  completedTasks: PropTypes.array,
  activeInvoices: PropTypes.array,
};

ClientList.defaultProps = {
  clients: [],
  estimatedTasks: [],
  completedTasks: [],
  activeInvoices: [],
};

export default compose(
  connect(
    ({
      firestore: {
        ordered: { clients, estimatedTasks, completedTasks, activeInvoices },
      },
    }) => ({ clients, estimatedTasks, completedTasks, activeInvoices }),
  ),
)(ClientList);
