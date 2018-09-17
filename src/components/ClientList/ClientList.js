import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './ClientList.css';

class ClientList extends React.Component {
    constructor(props) {
        super();

        this.state = {
            clients: []
        };

        props.clientRef.on('value', snapshot => {
            const clients = snapshot.val();
            const newClients = [];

            if (!clients) {
                return;
            }

            Object.keys(clients).forEach(clientId => {
                newClients.push({
                    id: clientId,
                    name: clients[clientId].name,
                    rate: clients[clientId].rate
                });
            });

            this.setState({
                clients: newClients
            });
        });
    }

    render() {
        return (
            <ul className="client-list">
                {this.state.clients.map(client => (
                    <li key={client.id}>
                        <NavLink
                            to={`/client/${client.id}`}
                            className="client-link"
                            activeClassName="client-link--active"
                        >
                            {client.name} - {client.rate}
                        </NavLink>
                    </li>
                ))}
            </ul>
        );
    }
}

ClientList.propTypes = {
    clientRef: PropTypes.object.isRequired
};

export default ClientList;
