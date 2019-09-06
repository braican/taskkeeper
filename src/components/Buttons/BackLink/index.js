import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ArrowIcon from '../../../svg/Arrow';

import styles from './BackLink.module.scss';

const BackLink = ({ to, className, onClick, children }) => {
  return (
    <Link to={to} className={`${styles.backlink} ${className}`} onClick={onClick}>
      <span className={styles.icon}>
        <ArrowIcon dir="left" />
      </span>
      {children}
    </Link>
  );
};

BackLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

BackLink.defaultProps = {
  className: null,
  onClick: null,
  children: null,
};

export default BackLink;
