import React from 'react';
import PropTypes from 'prop-types';

import styles from './Circle.module.scss';

const CircleButton = ({ onClick, icon: Icon, children }) => (
  <button className={styles.button} onClick={onClick}>
    {Icon && <Icon />}
    {children && <div>{children}</div>}
  </button>
);

CircleButton.defaultProps = {
  onClick: null,
  icon: null,
  children: null,
};

CircleButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.func,
  children: PropTypes.node,
};

export default CircleButton;
