import React from 'react';
import PropTypes from 'prop-types';

import ActiveInvoices from './ActiveInvoices';
import InvoiceArchive from './InvoiceArchive';


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


const ClientPane = (props) => {
    const { client } = props;
    const invoices = organizeInvoices(client.invoices);

    return (
        <div className="clientPane__main">
            <header className="clientHeader">
                <h2 className="clientname">{client.name}</h2>
                <p className="clientrate">{client.rate}</p>
            </header>

            <ActiveInvoices invoices={invoices.active} />
            <InvoiceArchive invoices={invoices.archive} />
        </div>
    );
};

ClientPane.propTypes = {
    client : PropTypes.object.isRequired,
};

export default ClientPane;
