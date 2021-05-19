import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Placard.module.scss';

const Placard = ({ children, to = null }) => {
  if (to) {
    return (
      <Link to={to} className={styles.placard}>
        {children}
      </Link>
    );
  }

  return <div className={styles.placard}>{children}</div>;
};

Placard.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
};

export default Placard;
