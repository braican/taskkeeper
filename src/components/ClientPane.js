import React from 'react';
import PropTypes from 'prop-types';

const ClientPane = (props) => {
    const clientList = props.clients;
    const client = clientList[props.params.clientId];

    return (
        <div className="masthead">
            <h2 className="clientname">{client.name}</h2>
            <p className="clientrate">{client.rate}</p>
        </div>
    );
};

ClientPane.propTypes = {
    clients : PropTypes.object.isRequired,
    params  : PropTypes.object.isRequired,
};

export default ClientPane;
