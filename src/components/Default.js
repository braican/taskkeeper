import React from 'react';
import PropTypes from 'prop-types';

const Default = (props) => {
    const { loaded, clients } = props;

    if (!loaded) {
        return (
            <div className="clientPane__noclients">
                <p>Loading...</p>
            </div>
        );
    }

    if (Object.keys(clients).length === 0) {
        return (
            <div className="clientPane__noclients">
                <p>Welcome to Taskkeeper. Add your first client.</p>
            </div>
        );
    }

    return (
        <div className="clientPane__noclients">
            <p className="appname">Welcome to Taskkeeper.</p>
        </div>
    );
};


Default.propTypes = {
    loaded  : PropTypes.bool,
    clients : PropTypes.object,
};

Default.defaultProps = {
    loaded  : false,
    clients : {},
};

export default Default;
