import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import LogoutButton from '../LogoutButton/LogoutButton';

import './Profile.css';

const Profile = ({ user, logout }) => (
    <div className="profile">
        <div className="profile__user">
            <div className="profile__headshot">
                <img src={user.photoURL} alt={`Thumbnail of ${user.displayName || user.email}`} />
            </div>

            <p className="profile__meta">{user.displayName || user.email}</p>
        </div>

        {logout ? <Route render={props => <LogoutButton {...props} click={logout} />} /> : null}
    </div>
);

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func
};

Profile.defaultProps = {
    logout: null
};

export default Profile;
