import React from 'react';
import PropTypes from 'prop-types';

const InvoiceArchive = (props) => {
    const { invoices } = props;

    return (
        <p>The ARCHIVE</p>
    );
};

InvoiceArchive.propTypes = {
    invoices : PropTypes.object.isRequired,
};

export default InvoiceArchive;
