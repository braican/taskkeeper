import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import { setupIdMap, computeTaskSubtotal } from '../../utils';

import ClientList from '../ClientList';
import FormattedPrice from '../Utils/FormattedPrice';
import Invoice from '../Invoice/Active';

import styles from './Dashboard.module.scss';

const Dashboard = ({
  displayName,
  activeInvoices,
  invoicedTasks,
  estimatedCount,
  estimatedSubtotal,
  completedCount,
  completedSubtotal,
}) => {
  return (
    <div>
      <h2 className={styles.welcome}>Welcome, {displayName}</h2>

      <div className={styles.dashboard}>
        <div className={styles.clientList}>
          <header>
            <h3 className="dash-header">Clients</h3>
          </header>
          <ClientList />
        </div>

        <div className={styles.activity}>
          <div>
            <h3 className="dash-header">Active Invoices</h3>
            {activeInvoices && activeInvoices.length > 0 ? (
              <ul>
                {activeInvoices.map(invoice => {
                  const invoiceTasks = invoice.tasks
                    .map(taskId => invoicedTasks[taskId])
                    .filter(task => typeof task !== 'undefined');

                  return (
                    <li key={invoice.id}>
                      <Invoice invoice={invoice} tasks={invoiceTasks} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>
                Everyone is all paid up{' '}
                <span className="emoji" role="img" aria-label="Paid up">
                  💸
                </span>
              </p>
            )}
          </div>

          <div>
            <h3 className="dash-header">Estimated</h3>
            {estimatedCount > 0 ? (
              <p>
                You have estimated{' '}
                <strong>
                  {estimatedCount} task{estimatedCount === 1 ? '' : 's'}
                </strong>
                , and {estimatedCount === 1 ? 'it is' : 'they are'} worth{' '}
                <strong>
                  <FormattedPrice price={estimatedSubtotal} />
                </strong>
                .
              </p>
            ) : (
              <p>You have no estimated tasks.</p>
            )}
          </div>

          <div>
            <h3 className="dash-header">Completed</h3>
            {completedCount > 0 ? (
              <p>
                You have completed{' '}
                <strong>
                  {completedCount} task{completedCount === 1 ? '' : 's'}
                </strong>
                , and {completedCount === 1 ? 'it is' : 'they are'} worth{' '}
                <strong>
                  <FormattedPrice price={completedSubtotal} />
                </strong>
                .
              </p>
            ) : (
              <p>You have no completed tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  displayName: PropTypes.string,
  activeInvoices: PropTypes.array,
  invoicedTasks: PropTypes.object,
  estimatedCount: PropTypes.number,
  estimatedSubtotal: PropTypes.number,
  completedCount: PropTypes.number,
  completedSubtotal: PropTypes.number,
};

Dashboard.defaultProps = {
  displayName: '',
  activeInvoices: [],
  invoicedTasks: {},
  estimatedCount: 0,
  estimatedSubtotal: 0,
  completedCount: 0,
  completedSubtotal: 0,
};

export default compose(
  connect(({ firebase, firestore }) => {
    const displayName = firebase.profile.displayName;
    const {
      activeInvoices,
      invoicedTasks,
      estimatedTasks,
      completedTasks,
      clients,
    } = firestore.ordered;

    const clientMap = isLoaded(clients) && clients ? setupIdMap(clients) : {};

    let estimatedSubtotal = 0;
    let estimatedCount = 0;

    let completedSubtotal = 0;
    let completedCount = 0;

    const reduceTaskPrices = (acc, task) => {
      if (!clientMap[task.client] || !clientMap[task.client].rate) {
        return acc;
      }

      const taskRate = clientMap[task.client].rate;
      return acc + computeTaskSubtotal(task, taskRate);
    };

    if (isLoaded(estimatedTasks) && estimatedTasks) {
      estimatedCount = estimatedTasks.length;
      estimatedSubtotal = estimatedTasks.reduce(reduceTaskPrices, 0);
    }

    if (isLoaded(completedTasks) && completedTasks) {
      completedCount = completedTasks.length;
      completedSubtotal = completedTasks.reduce(reduceTaskPrices, 0);
    }

    return {
      displayName,
      activeInvoices,
      invoicedTasks: setupIdMap(invoicedTasks),
      estimatedCount,
      estimatedSubtotal,
      completedCount,
      completedSubtotal,
    };
  }),
)(Dashboard);
