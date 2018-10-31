import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actionCreators from '../../actions/actionCreators';

import './styles.css';

class ClientList extends React.Component {
    render() {
        if (!this.props.uid) {
            return null;
        }

        return (
            <div className="client-admin">
                <NavLink
                    to="/"
                    className="overview-link"
                    activeClassName="overview-link--active"
                    exact={true}
                >
                    Overview
                </NavLink>

                <h3 className="client-list__header">Client List</h3>
                <ul className="client-list">
                    {this.props.clients.map(client => (
                        <li key={client.id} className="client-list__client">
                            <NavLink
                                to={`/client/${client.id}`}
                                className="client-link"
                                activeClassName="client-link--active"
                            >
                                {client.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="client-list__footer">
                    <button className="btn" onClick={this.props.toggleNewClientDrawer}>
                        Add new client
                    </button>
                </div>
            </div>
        );
    }
}

ClientList.propTypes = {
    uid: PropTypes.string,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleNewClientDrawer: PropTypes.func
};

const mapStateToProps = state => ({
    uid: state.firebase.auth.uid,
    clients: state.firestore.ordered.clients || []
});

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

const clientConnector = props => {
    if (!props.uid) {
        return [];
    }

    return [
        {
            collection: 'clients',
            where: [['uid', '==', props.uid]]
        }
    ];
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firestoreConnect(clientConnector)
)(ClientList);
