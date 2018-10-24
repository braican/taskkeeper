import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const Welcome = ({ login }) => (
    <div className="welcome">
        <div>
            <h1>Taskkeeper</h1>
            <p>Keep track of all your clients and tasks</p>
            <button onClick={login} className="space-top btn">
                Log In
            </button>
        </div>
    </div>
);

Welcome.propTypes = {
    login: PropTypes.func.isRequired
};

export default Welcome;
