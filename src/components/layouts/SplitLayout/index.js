import React from 'react';
import PropTypes from 'prop-types';

import styles from './SplitLayout.module.scss';

const SplitLayout = ({ children, split = 'even' }) => (
  <div className={`${styles.split} ${styles[`split--${split}`]}`}>{children}</div>
);

SplitLayout.propTypes = {
  split: PropTypes.oneOf(['even', 'uneven']),
  children: PropTypes.node,
};

export default SplitLayout;
