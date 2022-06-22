import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Placard.module.scss';

const Placard = ({ children, to = null, minimal = false }) => {
  if (to) {
    return (
      <Link to={to} className={minimal ? styles.listItem : styles.placard}>
        {children}
      </Link>
    );
  }

  return <div className={minimal ? styles.listItem : styles.placard}>{children}</div>;
};

Placard.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  minimal: PropTypes.bool,
};

export default Placard;
