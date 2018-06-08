import React from 'react';
import PropTypes from 'prop-types';

import TaskForm from './TaskForm';
import OpenTasks from './OpenTasks';
import Invoice from './Invoice';

import { formatPrice, getInvoicegroupTotal } from '../helpers';


/**
 * Organize the client's invoices into their respective statuses
 * @param {Object} invoices Invoices to organize
 */
function organizeInvoices(invoices) {
    const active = {};
    const archive = {};

    // make sure there are invoices
    if (!invoices) {
        return {
            active  : {},
            archive : {},
        };
    }

    Object.keys(invoices).reverse().forEach((invoiceId) => {
        const invoiceData = invoices[invoiceId];

        if (invoiceData.status === 'active') {
            active[invoiceId] = invoiceData;
        } else {
            archive[invoiceId] = invoiceData;
        }
    });

    return { active, archive };
}


//
// ClientPane
//
const ClientPane = (props) => {
    const {
        clientKey,
        client,
        loaded,

        // fn
        archiveInvoice,
        submitInvoice,
        saveTask,
        removeTask,
    } = props;

    if (!loaded) {
        return (
            <div className="clientPane__noclients">
                <p>Loading...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="clientPane__noclients">
                <p>Welcome to Taskkeeper. Choose a client from the sidebar.</p>
            </div>
        );
    }

    const { openTasks } = client;
    const invoices = organizeInvoices(client.invoices);


    //
    // render the invoice groups
    //

    /**
     * Render the group of invoices, with a header.
     * @param {Array} invoiceGroup Group of invoices
     */
    const renderInvoices = (invoiceGroup) => (
        Object.keys(invoiceGroup).map((invoiceId) => (
            <Invoice
                invoiceId={invoiceId}
                key={invoiceId}
                invoice={invoiceGroup[invoiceId]}
                archiveInvoice={(_invoiceId) => archiveInvoice(clientKey, _invoiceId)}
            />
        ))
    );

    /**
     * Render the outstanding invoice list
     * @param {Array} invoiceGroup Group of outstanding invoices
     */
    const renderOutstandingInvoices = (invoiceGroup) => (
        <section className="invoices invoices--outstanding">
            <header className="invoicegroup__header">
                <h3 className="t-blocktitle">Outstanding Invoices</h3>
                <p className="invoice__price moneydisplay">
                    {getInvoicegroupTotal(invoiceGroup, true)}
                </p>
            </header>
            {
                Object.keys(invoiceGroup).length > 0 ?
                    renderInvoices(invoiceGroup) :
                    <p>There are no outstanding invoices for this client.</p>
            }
        </section>
    );

    /**
     * Render the archive of invoices
     * @param {Array} invoiceGroup Group of archived invoices
     */
    const renderArchivedInvoices = (invoiceGroup) => {
        if (Object.keys(invoiceGroup).length === 0) {
            return null;
        }

        return (
            <section className="invoices invoices--archive">
                <header className="invoicegroup__header">
                    <h3 className="t-blocktitle">Invoice Archive</h3>
                    <p className="invoice__price moneydisplay">
                        {getInvoicegroupTotal(invoiceGroup, true)}
                    </p>
                </header>

                {renderInvoices(invoiceGroup)}
            </section>
        );
    };


    return (
        <div className="clientPane__main">
            <header className="clientHeader">
                <div className="l-container">
                    <h2 className="clientname">{client.name}</h2>
                    <p className="clientrate moneydisplay">{formatPrice(client.rate)}</p>
                </div>
            </header>

            <TaskForm addTask={props.addTask} client={client} clientKey={clientKey} />

            <OpenTasks
                tasks={openTasks}
                rate={client.rate}
                saveTask={(taskId, newTask) => saveTask(clientKey, taskId, newTask)}
                submitInvoice={(tasks) => submitInvoice(clientKey, tasks)}
                removeTask={(taskId) => removeTask(clientKey, taskId)}
            />

            <div className="clientInvoices l-container">
                {renderOutstandingInvoices(invoices.active)}
                {renderArchivedInvoices(invoices.archive)}
            </div>
        </div>
    );
};

ClientPane.propTypes = {
    clientKey      : PropTypes.string.isRequired,
    client         : PropTypes.object,
    addTask        : PropTypes.func.isRequired,
    submitInvoice  : PropTypes.func.isRequired,
    archiveInvoice : PropTypes.func.isRequired,
    loaded         : PropTypes.bool,
    saveTask       : PropTypes.func.isRequired,
    removeTask     : PropTypes.func.isRequired,
};

ClientPane.defaultProps = {
    client : null,
    loaded : false,
};

export default ClientPane;
