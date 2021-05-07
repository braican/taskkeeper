import React from 'react';
import PropTypes from 'prop-types';

import styles from './Button.module.scss';

const Button = ({ children, className = '', onClick = () => {} }) => (
  <button className={`${styles.button} ${className}`} onClick={onClick}>
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
