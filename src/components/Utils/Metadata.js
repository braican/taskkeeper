import React from 'react';
import PropTypes from 'prop-types';

const Metadata = ({ value, label }) => (
  <div>
    <span className="label">{label}</span>
    <p>{value}</p>
  </div>
);

Metadata.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Metadata.defaultProps = {
  label: '',
};

export default Metadata;
