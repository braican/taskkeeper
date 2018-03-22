import React from 'react';
import PropTypes from 'prop-types';

import TaskForm from './TaskForm';
import TaskList from './TaskList';
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

    Object.keys(invoices).forEach((invoiceId) => {
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


//
// RENDER
//


/**
 * Render the group of invoices, with a header.
 * @param {Array} invoiceGroup Group of invoices
 * @param {String} id Identifier for this invoice group
 * @param {String} header The header text for this group
 * @param {Number} rate Client billable rate
 */
function renderInvoices(invoiceGroup, id, header, rate) {
    if (Object.keys(invoiceGroup).length === 0) {
        return false;
    }

    const outstandingInvoiceTotal = (
        <p className="invoice__price moneydisplay">
            {getInvoicegroupTotal(invoiceGroup, rate)}
        </p>
    );

    return (
        <section className={`invoices invoices--${id}`}>
            <header className="invoicegroup__header">
                <h3 className="t-blocktitle">{header}</h3>
                {outstandingInvoiceTotal}
            </header>
            {
                Object.keys(invoiceGroup).map((invoiceId) => (
                    <Invoice
                        key={invoiceId}
                        invoice={invoiceGroup[invoiceId]}
                        rate={rate}
                    />
                ))
            }
        </section>
    );
}


/**
 * Renders the open task list
 * @param {Array} tasklist The outstanding task list
 * @param {Number} rate Client's billable rate
 */
function renderOpenTasks(tasklist, rate) {
    const notasksCopy = 'You have no billable tasks for this client.';
    return (
        <div className="l-container">
            {tasklist ? <TaskList tasks={tasklist} rate={rate} /> : <p>{notasksCopy}</p>}
        </div>
    );
}


const ClientPane = (props) => {
    const { clientKey, client } = props;
    const invoices = organizeInvoices(client.invoices);

    return (
        <div className="clientPane__main">
            <header className="clientHeader">
                <div className="l-container">
                    <h2 className="clientname">{client.name}</h2>
                    <p className="clientrate moneydisplay">{formatPrice(client.rate)}</p>
                </div>
            </header>

            <TaskForm addTask={props.addTask} client={client} clientKey={clientKey} />

            <section className="client__opentasks">
                {renderOpenTasks(client.openTasks, client.rate)}
            </section>

            <div className="clientInvoices l-container">
                {renderInvoices(invoices.active, 'outstanding', 'Outstanding Invoices', client.rate)}
                {renderInvoices(invoices.archive, 'archive', 'Invoice Archive', client.rate)}
            </div>
        </div>
    );
};

ClientPane.propTypes = {
    clientKey : PropTypes.string.isRequired,
    client    : PropTypes.object.isRequired,
    addTask   : PropTypes.func.isRequired,
};

export default ClientPane;
