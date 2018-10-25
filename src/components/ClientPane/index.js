import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import { formatPrice } from '../../util/helpers';

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

const mapDispatchToProps = {};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firestoreConnect()
)(ClientPane);
