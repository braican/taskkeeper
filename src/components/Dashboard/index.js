import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ClientList from '../ClientList';

import styles from './Dashboard.module.scss';

const Dashboard = ({ displayName }) => {
  return (
    <div>
      <h2 className={styles.welcome}>Welcome, {displayName}</h2>

      <div className={styles.dashboard}>
        <div className={styles.clientList}>
          <header>
            <h3 className="dash-header">Clients</h3>
          </header>
          <ClientList />
        </div>

        <div className={styles.activity}>
          <header>
            <h3 className="dash-header">Activity</h3>
          </header>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  displayName: PropTypes.string,
};

export default compose(
  connect(({ firebase: { profile: { displayName } } }) => ({ displayName })),
)(Dashboard);
