import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import './styles.css';

class ClientPane extends React.Component {
    constructor() {
        super();

        this.state = {
            name: ''
        };
    }

    componentDidMount() {
        const { firestore, clientId } = this.props;
        firestore.get(`clients/${clientId}`).then(doc => {
            const { name, rate } = doc.data();
            this.setState({ name, rate });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.clientId !== prevProps.clientId) {
            const { firestore, clientId } = this.props;
            firestore.get(`clients/${clientId}`).then(doc => {
                const { name, rate } = doc.data();
                this.setState({ name, rate });
            });
        }
    }
    render() {
        return (
            <div>
                <header>
                    <h1>{this.state.name}</h1>
                </header>
            </div>
        );
    }
}

ClientPane.propTypes = {
    firestore: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired
};

// export default ClientPane;

const mapStateToProps = state => {
    return {
        firestore: state.firestore
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
