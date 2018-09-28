import React from 'react';
import PropTypes from 'prop-types';

const LogoutButton = ({ click, history }) => (
    <button
        className="btn"
        onClick={() => {
            click();
            history.push('/');
        }}
    >
        Logout
    </button>
);

LogoutButton.propTypes = {
    history: PropTypes.object.isRequired,
    click: PropTypes.func.isRequired
};

export default LogoutButton;
