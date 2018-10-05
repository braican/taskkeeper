import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import LogoutButton from '../LogoutButton/LogoutButton';

import './Profile.css';

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {
            drawer_active: false
        };

        this.toggle_drawer = this.toggle_drawer.bind(this);
    }

    toggle_drawer() {
        const drawer_state = this.state.drawer_active;

        this.setState({ drawer_active: !drawer_state });
    }

    render() {
        const { user, logout } = this.props;
        const { drawer_active } = this.state;
        return (
            <div className={`profile${drawer_active ? ' profile--expanded' : ''}`}>
                <button className="profile__user" onClick={this.toggle_drawer}>
                    <div className="profile__headshot">
                        <img
                            src={user.photoURL}
                            alt={`Thumbnail of ${user.displayName || user.email}`}
                        />
                    </div>

                    <p className="profile__meta">{user.displayName || user.email}</p>
                </button>

                <div className={`util-drawer${drawer_active ? ' util-drawer--active' : ''}`}>
                    <ul>
                        {logout ? (
                            <li>
                                <Route
                                    render={props => <LogoutButton {...props} click={logout} />}
                                />
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func
};

Profile.defaultProps = {
    logout: null
};

export default Profile;
