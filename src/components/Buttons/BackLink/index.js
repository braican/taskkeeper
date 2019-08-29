import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ArrowIcon from '../../../svg/Arrow';

import styles from './BackLink.module.scss';

const BackLink = ({ to, className, children }) => {
  return (
    <Link to={to} className={`${styles.backlink} ${className}`}>
      <span className={styles.icon}>
        <ArrowIcon dir="left" />
      </span>
      {children}
    </Link>
  );
};

BackLink.defaultProps = {
  children: null,
  className: null,
};

BackLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default BackLink;
