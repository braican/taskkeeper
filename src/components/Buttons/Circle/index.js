import React from 'react';
import PropTypes from 'prop-types';
import { className } from '../../../utils';

import styles from './Circle.module.scss';

const CircleButton = ({ onClick, bg, icon: Icon, label, children }) => {
  const buttonStyles = [styles.button];

  if (bg === 'red') {
    buttonStyles.push(styles.buttonRed);
  }

  return (
    <button {...className(...buttonStyles)} onClick={onClick}>
      {Icon && <Icon />}
      {label && <span className={styles.label}>{label}</span>}
      {children && <div>{children}</div>}
    </button>
  );
};

CircleButton.propTypes = {
  onClick: PropTypes.func,
  bg: PropTypes.oneOf(['green', 'red']),
  icon: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
};

CircleButton.defaultProps = {
  onClick: null,
  bg: 'green',
  icon: null,
  label: null,
  children: null,
};

export default CircleButton;
