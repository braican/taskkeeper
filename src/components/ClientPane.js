import React from 'react';
import PropTypes from 'prop-types';

import TaskForm from './TaskForm';
import OpenTasks from './OpenTasks';
import Invoice from './Invoice';

import { formatPrice, getTasklistSubtotal } from '../helpers';


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


function getInvoicegroupTotal(invoices, rate) {
    const subtotal = Object.keys(invoices).reduce((total, invoiceId) => {
        const invoice = invoices[invoiceId];

        if (!invoice.tasks) {
            return total;
        }

        return total + getTasklistSubtotal(invoice.tasks, rate);
    }, 0);

    return formatPrice(subtotal);
}


const ClientPane = (props) => {
    const { clientKey, client } = props;
    const { openTasks, rate } = client;
    const invoices = organizeInvoices(client.invoices);


    /**
     * Client-knowledgeable submit invoice
     * @param {Array} tasks List of tasks
     */
    const clientSubmitInvoice = (tasks) => {
        props.submitInvoice(clientKey, tasks);
    };


    /**
     * Client-knowledgeable archive invoice
     */
    const clientArchiveInvoice = (invoiceId) => {
        props.archiveInvoice(clientKey, invoiceId);
    };


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
                rate={rate}
                archiveInvoice={clientArchiveInvoice}
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
                    {getInvoicegroupTotal(invoiceGroup, rate)}
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
                        {getInvoicegroupTotal(invoiceGroup, rate)}
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

            <OpenTasks submitInvoice={clientSubmitInvoice} tasks={openTasks} rate={client.rate} />

            <div className="clientInvoices l-container">
                {renderOutstandingInvoices(invoices.active)}
                {renderArchivedInvoices(invoices.archive)}
            </div>
        </div>
    );
};

ClientPane.propTypes = {
    clientKey      : PropTypes.string.isRequired,
    client         : PropTypes.object.isRequired,
    addTask        : PropTypes.func.isRequired,
    submitInvoice  : PropTypes.func.isRequired,
    archiveInvoice : PropTypes.func.isRequired,
};

export default ClientPane;
