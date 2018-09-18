import React from 'react';
import PropTypes from 'prop-types';

class ClientPane extends React.Component {
    constructor() {
        super();

        this.state = {
            clientKey: null,
            client: null
        };

        this.updateClient = this.updateClient.bind(this);
    }

    componentDidMount() {
        this.updateClient();
    }

    componentDidUpdate(prevProps) {
        if (this.props.slug !== prevProps.slug) {
            this.updateClient();
        }
    }

    /**
     * Updates state with the client
     */
    updateClient() {
        this.props.clientRef.on('value', snapshot => {
            const client = snapshot.val();

            Object.keys(client).forEach(clientKey => {
                this.setState({
                    clientKey,
                    client: client[clientKey]
                });
            });
        });
    }

    render() {
        if (this.state.client === null) {
            return null;
        }

        return (
            <div>
                <header>
                    <h2>{this.state.client.name}</h2>
                    <p>{this.state.client.rate}</p>
                </header>
                <div className="client-main" />
            </div>
        );
    }
}

ClientPane.propTypes = {
    slug: PropTypes.string.isRequired,
    clientRef: PropTypes.object
};

ClientPane.defaultProps = {
    clientRef: undefined
};

export default ClientPane;
