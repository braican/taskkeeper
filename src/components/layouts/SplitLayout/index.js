import React from 'react';
import PropTypes from 'prop-types';

import styles from './SplitLayout.module.scss';

const SplitLayout = ({ children }) => <div className={styles.split}>{children}</div>;

SplitLayout.propTypes = {
  children: PropTypes.node,
};

export default SplitLayout;
