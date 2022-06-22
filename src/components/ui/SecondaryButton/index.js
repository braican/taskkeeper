import React from 'react';
import PropTypes from 'prop-types';

import styles from './SecondaryButton.module.scss';

const SecondaryButton = ({ children, onClick = null }) => (
  <button type="button" onClick={onClick} className={styles.button}>
    {children}
  </button>
);

SecondaryButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default SecondaryButton;
