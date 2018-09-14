import React from 'react';
import PropTypes from 'prop-types';

import './Profile.css';

const Profile = ({ user }) => (
    <div className="profile">
        <div className="profile__headshot">
            <img src={user.photoURL} alt={`Thumbnail of ${user.displayName || user.email}`} />
        </div>

        <p>{user.displayName || user.email}</p>
    </div>
);

Profile.propTypes = {
    user: PropTypes.object.isRequired
};

export default Profile;
