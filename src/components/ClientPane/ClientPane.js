import React from 'react';
import PropTypes from 'prop-types';

import TaskForm from '../TaskForm/TaskForm';
import TaskList from '../TaskList/TaskList';

import { formatPrice } from '../../util/util';

import './ClientPane.css';

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
        this.props.clientRef.then(doc => {
            const client = doc.data();
            this.setState({
                clientKey: doc.id,
                client: client
            });
        });
    }

    render() {
        if (this.state.client === null) {
            return null;
        }

        const rate = parseFloat(this.state.client.rate);

        return (
            <div>
                <header>
                    <h2 className="client__name">{this.state.client.name}</h2>
                    <p>{formatPrice(this.state.client.rate)}</p>
                </header>
                <div className="client-main">
                    <TaskForm taskRef={this.props.taskRef} clientKey={this.state.clientKey} />
                    <TaskList
                        taskRef={this.props.taskRef}
                        clientKey={this.state.clientKey}
                        rate={rate}
                    />
                </div>
            </div>
        );
    }
}

ClientPane.propTypes = {
    slug: PropTypes.string.isRequired,
    clientRef: PropTypes.object,
    invoiceRef: PropTypes.object,
    taskRef: PropTypes.object
};

ClientPane.defaultProps = {
    clientRef: null,
    invoiceRef: null,
    taskRef: null
};

export default ClientPane;
