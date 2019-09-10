import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isLoaded, firestoreConnect } from 'react-redux-firebase';

import { clientFilter, className } from '../../utils';
import { invoice as invoiceStatus } from '../../utils/status';

import FormattedPrice from '../Utils/FormattedPrice';
import BackLink from '../Buttons/BackLink';
import AddTask from '../AddTask';
import EstimatedTasks from './EstimatedTasks';
import CompletedTasks from './CompletedTasks';
import ActiveInvoices from './ActiveInvoices';
import ArchivedInvoices from './ArchivedInvoices';
import FormEl from '../Forms/FormEl';
import FadeIn from '../Transitions/FadeIn';
import GearIcon from '../../svg/Gear';

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
  userRef,
}) => {
  const [nextInvoiceId, setNextInvoiceId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(client.address);
  const [symbol, setSymbol] = useState(client.symbol);
  const [updated, setUpdated] = useState(false);

  const handleSave = () => {
    setIsEditing(false);

    if (!userRef || !updated) {
      return;
    }

    setUpdated(false);
    userRef
      .collection('clients')
      .doc(client.id)
      .update({ address, symbol });
  };

  return (
    <ClientContext.Provider
      value={{
        id: client.id,
        symbol,
        rate: client.rate,
        nextInvoiceId,
        setNextInvoiceId,
      }}>
      <div className={styles.client}>
        <BackLink className={styles.dashLink} to="/dashboard" onClick={unsetInvoicing}>
          Dashboard
        </BackLink>

        <header className={styles.client__header}>
          <div className={styles.header__left}>
            <h2 className={styles.client__name}>{client.name}</h2>

            <p>
              <FormattedPrice price={client.rate} />
            </p>
          </div>

          <div {...className('stack', styles.header__right, isEditing && styles.editingClient)}>
            <FormEl
              id="client-address"
              type="textarea"
              label="Address"
              className={styles.addressInput}
              value={address}
              onChange={event => {
                setAddress(event.target.value);
                setUpdated(true);
              }}
              inputConfig={isEditing ? {} : { disabled: true }}
              absoluteLabel
            />

            <FormEl
              id="client-symbol"
              label="Symbol"
              className={styles.symbolInput}
              value={symbol}
              onChange={event => {
                setSymbol(event.target.value);
                setUpdated(true);
              }}
            />
          </div>

          <div className={styles.editActions}>
            {isEditing ? (
              <button onClick={handleSave} className="button">
                Save
              </button>
            ) : (
              <button className={styles.editClient} onClick={() => setIsEditing(true)}>
                <GearIcon />
              </button>
            )}
          </div>
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
    rate: PropTypes.string,
    id: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  activeInvoices: PropTypes.array,
  estimatedTasks: PropTypes.array,
  completedTasks: PropTypes.array,
  invoicedTasks: PropTypes.object,
  archivedInvoices: PropTypes.array,
  unsetInvoicing: PropTypes.func.isRequired,
  userRef: PropTypes.object,
};

Client.defaultProps = {
  activeInvoices: [],
  estimatedTasks: [],
  completedTasks: [],
  invoicedTasks: {},
  archivedInvoices: [],
  userRef: null,
};

export default compose(
  connect(
    ({ firestore, firebase: { auth }, userRef }, props) => {
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
      const invoicedTasks = clientFilter(allInvoicedTasks, id).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      return {
        auth,
        client,
        activeInvoices,
        estimatedTasks,
        completedTasks,
        invoicedTasks,
        archivedInvoices,
        userRef,
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
