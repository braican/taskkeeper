import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Block.module.scss';

const Block = ({ children, className }) => (
  <div className={classnames(styles.block, className)}>{children}</div>
);

Block.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Block;
