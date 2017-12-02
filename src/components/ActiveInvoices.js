import React from 'react';
import PropTypes from 'prop-types';


function renderTasks(tasks, key) {
    if (!tasks) {
        return false;
    }


    return (
        <ul>
            {tasks.map((task) => <li key={`${key}-${task.description}`}>{task.description}</li>)}
        </ul>
    );
}


function renderInvoice(invoices, key) {
    const invoice = invoices[key];

    return (
        <div>
            <p>{invoice.invoicedate}</p>

            {renderTasks(invoice.tasks, key)}
        </div>
    );
}


const ActiveInvoices = (props) => {

    const { invoices } = props;

    if (!invoices) {
        return false;
    }

    return (
        <ul>
            {Object.keys(invoices).map((key) => <li key={key}>{renderInvoice(invoices, key)}</li>)}
        </ul>
    );
};

ActiveInvoices.propTypes = {
    invoices : PropTypes.object.isRequired,
};

export default ActiveInvoices;
