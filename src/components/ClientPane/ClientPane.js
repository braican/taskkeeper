import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';

import ClientHeader from '../ClientHeader';
import TaskForm from '../TaskForm';
import TaskList from '../TaskList';
import InvoiceList from '../InvoiceList';

const mapStateToProps = (state, props) => {
  if (!state.firestore.data.userClients) {
    return {};
  }

  const { clientId } = props.match.params;

  return {
    uid: state.firebase.auth.uid,
    clientId,
    client: state.firestore.data.userClients[clientId],
    estimatedTasks: state.firestore.ordered[`${clientId}_estimated_tasks`],
    completedTasks: state.firestore.ordered[`${clientId}_completed_tasks`],
    activeInvoices: state.firestore.ordered[`${clientId}_active_invoices`],
    fulfilledInvoices: state.firestore.ordered[`${clientId}_fulfilled_invoices`],
  };
};

const taskQuery = ({ uid, clientId }) => {
  if (!clientId || !uid) {
    return [];
  }

  return [
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['client', '==', clientId], ['status', '==', 'estimated']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_estimated_tasks`,
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['client', '==', clientId], ['status', '==', 'completed']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_completed_tasks`,
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'invoices',
          where: [['client', '==', clientId], ['status', '==', 'active']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_active_invoices`,
    },
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'invoices',
          where: [['client', '==', clientId], ['status', '==', 'fulfilled']],
          orderBy: ['timestamp'],
        },
      ],
      storeAs: `${clientId}_fulfilled_invoices`,
    },
  ];
};

const ClientPane = ({
  match,
  client,
  estimatedTasks,
  completedTasks,
  activeInvoices,
  fulfilledInvoices,
}) => {
  if (!client) {
    return null;
  }

  const { clientId } = match.params;

  return (
    <ClientContext.Provider value={{ ...client, clientId }}>
      <ClientHeader />
      <TaskForm />
      {estimatedTasks === undefined && completedTasks === undefined ? (
        <p>Loading...</p>
      ) : (
        <>
          <TaskList tasks={estimatedTasks} header="Estimated Tasks" hasUtility />
          <TaskList tasks={completedTasks} header="Completed Tasks" canInvoice />
          <InvoiceList invoices={activeInvoices} header="Active Invoices" />
          <InvoiceList invoices={fulfilledInvoices} header="Fulfilled Invoices" />
        </>
      )}
    </ClientContext.Provider>
  );
};

ClientPane.propTypes = {
  // Used in `mapStateToProps` only
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }),
  }),
  client: PropTypes.shape({
    name: PropTypes.string,
  }),
  estimatedTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  completedTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  activeInvoices: PropTypes.arrayOf(PropTypes.shape({})),
  fulfilledInvoices: PropTypes.arrayOf(PropTypes.shape({})),
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(taskQuery),
)(ClientPane);
