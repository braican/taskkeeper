import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// import helpers
import { formatPrice } from '../helpers';


const getOutstandingStatus = (client) => {
    if (!client.invoices) {
        return false;
    }

    const anyActive = Object.entries(client.invoices).some(([invoiceId, invoiceData]) => {
        return invoiceData.status === 'active';
    });

    return anyActive;
};

const getActiveStatus = (client) => client.openTasks;


const ClientSidebar = (props) => {
    /**
     * Renders the client listing
     * @param {string} key object key for the client
     */
    const renderClientThumb = (key) => {
        const client = props.clients[key];
        const isActive = getActiveStatus(client);
        const hasOutstanding = getOutstandingStatus(client);
        const thumbclass = `clientThumb${isActive ? ' clientThumb--active' : ''}${hasOutstanding ? ' clientThumb--outstanding' : ''}`;

        return (
            <li className={thumbclass} key={key}>
                <NavLink to={`/client/${key}`} className="clientLink" activeClassName="clientLink--active">
                    <h3 className="clientthumb__name">{client.name}</h3>
                    <p className="clientthumb__rate">{formatPrice(client.rate)}</p>
                </NavLink>
            </li>
        );
    };

    return (
        <div>
            <ul className="clientList">
                {Object.keys(props.clients).map((key) => renderClientThumb(key))}
            </ul>

            <div className="newclient">
                <button className="newclient__btn" onClick={() => props.toggleNewClientForm()}>
                    <span className="u-textcenter">Add new client</span>
                </button>
            </div>
        </div>
    );
};

ClientSidebar.propTypes = {
    toggleNewClientForm : PropTypes.func.isRequired,
    clients             : PropTypes.object.isRequired,
};


export default ClientSidebar;
