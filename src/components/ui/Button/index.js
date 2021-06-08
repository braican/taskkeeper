import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Button.module.scss';

const Button = ({ children, style = '', className = '', type = 'button', onClick = () => {} }) => (
  <button
    className={classnames(styles.button, className, style && styles[`style--${style}`])}
    onClick={onClick}
    type={type}>
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOf(['', 'green', 'warning', 'black', 'transparent']),
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
