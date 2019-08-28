import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ClientList from '../ClientList';

const Dashboard = ({ displayName }) => {
  return (
    <div>
      <h2>Welcome, {displayName}</h2>

      <ClientList />
    </div>
  );
};

Dashboard.propTypes = {
  displayName: PropTypes.string,
};

export default compose(
  connect(({ firebase: { profile: { displayName } } }) => ({ displayName })),
)(Dashboard);
