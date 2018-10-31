import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formatPrice } from '../../util/helpers';

import TaskForm from '../TaskForm';
import BacklogTasks from '../BacklogTasks';

import './styles.css';

class ClientPane extends React.Component {
    render() {
        if (!this.props.client) {
            return <h2>Loading</h2>;
        }

        const { name, rate } = this.props.client;

        return (
            <div>
                <header>
                    <h1>{name}</h1>
                    <p>{formatPrice(rate)}</p>
                </header>

                <TaskForm clientId={this.props.clientId} />
                <BacklogTasks clientId={this.props.clientId} />
            </div>
        );
    }
}

ClientPane.propTypes = {
    client: PropTypes.object,
    clientId: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => {
    if (!state.firestore.data.clients) {
        return {};
    }

    return {
        client: state.firestore.data.clients[props.clientId]
    };
};

export default connect(mapStateToProps)(ClientPane);
