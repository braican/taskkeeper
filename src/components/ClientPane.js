import React from 'react';
import PropTypes from 'prop-types';


function organizeInvoices(invoices) {
    const inactiveInvoices = {};
    const activeInvoices = {};

    Object.keys(invoices).forEach((invoiceId) => {
        const invoiceData = invoices[invoiceId];

        if (invoiceData.status === 'active') {
            activeInvoices[invoiceId] = invoiceData;
        } else {
            inactiveInvoices[invoiceId] = invoiceData;
        }
    });

    return { inactiveInvoices, activeInvoices };
}


const ClientPane = (props) => {
    const { client } = props;
    const invoices = organizeInvoices(client.invoices);

    console.log(invoices);

    return (
        <div>
            <h2 className="clientname">{client.name}</h2>
            <p className="clientrate">{client.rate}</p>

            <div className="invoices">

            </div>
        </div>
    );
};

ClientPane.propTypes = {
    client : PropTypes.object.isRequired,
};

export default ClientPane;
