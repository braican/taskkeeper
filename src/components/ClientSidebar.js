import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// import helpers
import { formatPrice } from '../helpers';


const ClientSidebar = (props) => {
    /**
     * Renders the client listing
     * @param {string} key object key for the client
     */
    const renderClientList = (key) => {
        const client = props.clients[key];

        return (
            <NavLink to={`/client/${key}`} className="clientLink" activeClassName="clientLink--active">
                <h3 className="clientthumb__name">{client.name}</h3>
                <p className="clientthumb__rate">{formatPrice(client.rate)}</p>
            </NavLink>
        );
    };

    return (
        <div>
            <ul className="clientList">
                {
                    Object.keys(props.clients).map((key) => (
                        <li className="clientThumb" key={key}>{renderClientList(key)}</li>
                    ))
                }
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
