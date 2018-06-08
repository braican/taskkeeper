import React from 'react';
import PropTypes from 'prop-types';

import Invoice from './Invoice';

import { getInvoicegroupTotal, formatPrice } from '../helpers';

/**
 * Get all open invoices from all clients
 * @param {object} clients All the client data
 */
const getOpenInvoices = (clients) => {
    const openInvoices = {};
    Object.keys(clients).map((clientId) => {
        const client = clients[clientId];
        if (client.invoices) {
            const clientInvoices = {};
            let hasActives = false;
            Object.keys(client.invoices).map((invoiceId) => {
                if (client.invoices[invoiceId].status === 'active') {
                    hasActives = true;
                    clientInvoices[invoiceId] = client.invoices[invoiceId];
                }

                return invoiceId;
            });
            if (hasActives) {
                openInvoices[clientId] = clientInvoices;
            }
        }
        return client;
    });

    return openInvoices;
};


/**
 * Aggregate the price of all the open invoices
 * @param {object} openInvoices Unpaid invoices
 * @param {object} clients The clients list
 */
const priceAllOpenInvoices = (openInvoices, clients) => {
    const subtotal = Object.keys(openInvoices)
        .map((clientId) => getInvoicegroupTotal(openInvoices[clientId], clients[clientId].rate))
        .reduce((total, val) => total + val, 0);

    return formatPrice(subtotal);
};


const Homepage = (props) => {
    const { loaded, clients, archiveInvoice } = props;

    if (!loaded) {
        return (
            <div className="clientPane__noclients">
                <p>Loading...</p>
            </div>
        );
    }

    if (Object.keys(clients).length === 0) {
        return (
            <div className="clientPane__noclients">
                <p>Welcome to Taskkeeper. Add your first client.</p>
            </div>
        );
    }

    const openInvoices = getOpenInvoices(clients);

    if (Object.keys(openInvoices).length === 0) {
        return (
            <div className="clientPane__noclients">
                <p className="appname">Welcome to Taskkeeper.</p>
            </div>
        );
    }

    return (
        <div className="clientPane__noclients">
            <section className="invoices invoices--homepage l-container">
                <header className="invoicegroup__header">
                    <h3 className="t-blocktitle">Outstanding Invoices</h3>
                    <p className="invoice__price moneydisplay">
                        {priceAllOpenInvoices(openInvoices, clients)}
                    </p>
                </header>
                {
                    Object.keys(openInvoices).map((clientId) => (
                        <div key={clientId} className="invoices invoices--header">
                            <header className="invoicegroup__header">
                                <h3 className="t-blocktitle">{ clients[clientId].name }</h3>
                            </header>

                            { Object.keys(openInvoices[clientId]).map((invoiceId) => (
                                <Invoice
                                    invoiceId={invoiceId}
                                    key={invoiceId}
                                    invoice={openInvoices[clientId][invoiceId]}
                                    archiveInvoice={() => archiveInvoice(clientId, invoiceId)}
                                />
                            )) }
                        </div>
                    ))
                }
            </section>
        </div>
    );
};


Homepage.propTypes = {
    loaded         : PropTypes.bool,
    clients        : PropTypes.object,
    archiveInvoice : PropTypes.func.isRequired,
};

Homepage.defaultProps = {
    loaded  : false,
    clients : {},
};

export default Homepage;
