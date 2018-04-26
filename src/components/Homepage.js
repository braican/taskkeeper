import React from 'react';
import PropTypes from 'prop-types';

import Invoice from './Invoice';

import { getInvoicegroupTotal } from '../helpers';

/**
 * Get all open invoices from all clients
 * @param object clients All the client data
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

const Homepage = (props) => {
    const { loaded, clients } = props;

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

    const openInvoices = getOpenInvoices(props.clients);
    const rate = '50';

    if (Object.keys(openInvoices).length === 0) {
        return (
            <div className="clientPane__noclients">
                <p className="appname">Welcome to Taskkeeper.</p>
            </div>
        );
    }

    return (
        <div className="clientPane__noclients">
            <section className="invoices invoices--outstanding">
                <header className="invoicegroup__header">
                    <h3 className="t-blocktitle">Outstanding Invoices</h3>
                    <p className="invoice__price moneydisplay">
                        {getInvoicegroupTotal(openInvoices, rate)}
                    </p>
                </header>
                {
                    // Object.keys(openInvoices).map((invoiceId) => (
                    //     <Invoice
                    //         invoiceId={invoiceId}
                    //         key={invoiceId}
                    //         invoice={openInvoices[invoiceId]}
                    //         rate={rate}
                    //         archiveInvoice={() => 1}
                    //     />
                    // ))
                }
            </section>
        </div>
    );
};


Homepage.propTypes = {
    loaded  : PropTypes.bool,
    clients : PropTypes.object,
};

Homepage.defaultProps = {
    loaded  : false,
    clients : {},
};

export default Homepage;
