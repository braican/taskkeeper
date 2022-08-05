import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Button.module.scss';

const Button = ({ children, style = [], className = '', type = 'button', onClick = () => {} }) => {
  if (typeof style === 'string') {
    style = [style];
  }

  return (
    <button
      className={classnames(
        styles.button,
        className,
        style.map(s => styles[`style--${s}`]),
      )}
      onClick={onClick}
      type={type}>
      {children}
    </button>
  );
};

const availableClasses = [
  '',
  'green',
  'warning',
  'black',
  'orange',
  'transparent',
  'fullwidth',
  'translucent',
];

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.oneOf(availableClasses),
    PropTypes.arrayOf(PropTypes.oneOf(availableClasses)),
  ]),
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
