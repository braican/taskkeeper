import React from 'react';
import PropTypes from 'prop-types';

import './User.scss';

const User = ({ name, avatar }) => (
  <div className="User">
    <div className="avatar">
      <img src={avatar} alt={name} />
    </div>
  </div>
);

User.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
};

export default User;
