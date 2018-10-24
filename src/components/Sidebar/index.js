import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const Sidebar = ({ children }) => <aside className="sidebar">{children}</aside>;

Sidebar.propTypes = {
    children: PropTypes.node
};

export default Sidebar;
