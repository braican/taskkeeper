import React from 'react';
import PropTypes from 'prop-types';

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

                    <span className="menu-toggle">
                        <span className="menu-toggle__icon" />
                    </span>
                </button>

                <div className={`util-drawer${drawer_active ? ' util-drawer--active' : ''}`}>
                    <ul>
                        <li>
                            <button className="profile__logout" onClick={logout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
};

export default Profile;
