import React from 'react';
import { NavLink } from 'react-router-dom';

import CrosshairIcon from '../../svg/crosshair.js';
import styles from './DashboardButton.module.scss';

const DashboardButton = () => (
  <NavLink
    exact
    to="/"
    className={styles.dashboardLink}
    activeClassName={styles.dashboardLink__active}>
    <span>Dashboard</span>
    <CrosshairIcon />
  </NavLink>
);

export default DashboardButton;
