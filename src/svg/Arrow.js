import React from 'react';

import PropTypes from 'prop-types';

const getTransform = dir => {
  switch (dir) {
    case 'left':
      return 'rotate(90deg)';
    case 'up':
      return 'rotate(180deg)';
    case 'right':
      return 'rotate(-90deg)';
    default:
      return 'none';
  }
};

const ArrowIcon = ({ dir }) => (
  <svg viewBox="0 0 24 24" style={{ transformOrigin: 'center', transform: getTransform(dir) }}>
    <path d="M18.293 11.293l-5.293 5.293v-11.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v11.586l-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l7 7c0.096 0.096 0.207 0.168 0.325 0.217 0.12 0.049 0.247 0.075 0.374 0.076 0.133 0.001 0.266-0.024 0.39-0.076 0.118-0.049 0.229-0.121 0.325-0.217l7-7c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z" />
  </svg>
);

ArrowIcon.defaultProps = {
  dir: 'down', // default since that's the natural direction of the svg.
};

ArrowIcon.propTypes = {
  dir: PropTypes.oneOf(['left', 'right', 'up', 'down']),
};

export default ArrowIcon;
