import React from 'react';
import PropTypes from 'prop-types';

import styles from './Circle.module.scss';

const CircleButton = ({ onClick, icon: Icon, label, children }) => (
  <button className={styles.button} onClick={onClick}>
    {Icon && <Icon />}
    {label && <span className={styles.label}>{label}</span>}
    {children && <div>{children}</div>}
  </button>
);

CircleButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
};

CircleButton.defaultProps = {
  onClick: null,
  icon: null,
  label: null,
  children: null,
};

export default CircleButton;
