import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import * as actionCreators from '../../actions/actionCreators';

import Welcome from '../Welcome/Welcome';
import Profile from '../Profile/Profile';

class Auth extends React.Component {
    componentDidUpdate() {
        const { auth, toggleAuthenticatedUser } = this.props;
        if (!isLoaded(auth) || isEmpty(auth)) {
            toggleAuthenticatedUser(false);
        } else {
            toggleAuthenticatedUser(true);
        }
    }
    render() {
        const { auth, firebase } = this.props;
        const authSettings = {
            provider: 'google',
            type: 'popup'
        };

        // Check if we're loading
        if (!isLoaded(auth)) {
            return (
                <div className="welcome">
                    <p>Loading</p>
                </div>
            );
        }

        // Check if the auth is empty
        if (isEmpty(auth)) {
            return <Welcome login={() => firebase.login(authSettings)} />;
        }

        // Authenticated, let's go
        return <Profile user={auth} logout={() => firebase.logout()} />;
    }
}

Auth.propTypes = {
    auth: PropTypes.object,
    firebase: PropTypes.shape({
        login: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    }),
    toggleAuthenticatedUser: PropTypes.func
};

const mapStateToProps = state => ({ auth: state.firebase.auth });
const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firebaseConnect()
)(Auth);
