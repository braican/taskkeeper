import React from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';

const Icon = ({ label = '', viewBox = '', icon }) => (
  <>
    {label && <span className={styles.label}>{label}</span>}
    <svg className={styles.svg} viewBox={viewBox}>
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
  </>
);

Icon.propTypes = {
  label: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default Icon;
