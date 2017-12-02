import React from 'react';
import PropTypes from 'prop-types';

import Invoice from './Invoice';

import { formatPrice } from '../helpers';


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

    return (
        <div className={`invoices invoices--${id}`}>
            <div>{header}</div>
            {
                Object.keys(invoiceGroup).map((invoiceId) => (
                    <Invoice
                        key={invoiceId}
                        index={invoiceId}
                        invoice={invoiceGroup[invoiceId]}
                        rate={rate}
                    />
                ))
            }
        </div>
    );
}


const ClientPane = (props) => {
    const { client } = props;
    const invoices = organizeInvoices(client.invoices);

    return (
        <div className="clientPane__main">
            <header className="clientHeader">
                <h2 className="clientname">{client.name}</h2>
                <p className="clientrate">{formatPrice(client.rate)}</p>
            </header>

            <div className="clientInvoices">
                {renderInvoices(invoices.active, 'outstanding', 'Outstanding Invoices', client.rate)}
                {renderInvoices(invoices.archive, 'archive', 'Invoice Archive', client.rate)}
            </div>
        </div>
    );
};

ClientPane.propTypes = {
    client : PropTypes.object.isRequired,
};

export default ClientPane;
