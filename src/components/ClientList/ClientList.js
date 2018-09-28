import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './ClientList.css';

class ClientList extends React.Component {
    constructor() {
        super();

        this.state = {
            clients: []
        };
    }

    componentDidMount() {
        this.props.clientRef.onSnapshot(snapshot => {
            const newClients = [];

            snapshot.forEach(doc => {
                const newClient = doc.data();
                newClient.id = doc.id;
                newClients.push(newClient);
            });

            this.setState({ clients: newClients });
        });
    }

    render() {
        return (
            <ul className="client-list">
                {this.state.clients.map(client => (
                    <li key={client.id}>
                        <NavLink
                            to={`/client/${client.slug}`}
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
