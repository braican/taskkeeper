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
            <div className="client-admin">
                <ul className="client-list">
                    {this.state.clients.map(client => (
                        <li key={client.id} className="client-list__client">
                            <NavLink
                                to={`/client/${client.slug}`}
                                className="client-link"
                                activeClassName="client-link--active"
                            >
                                {client.name} <br />${client.rate}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {this.props.openPane ? (
                    <div className="client-list__footer">
                        <button className="btn" onClick={this.props.openPane}>
                            New Client
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

ClientList.propTypes = {
    clientRef: PropTypes.object.isRequired,
    openPane: PropTypes.func
};

ClientList.defaultProps = {
    openPane: null
};

export default ClientList;
