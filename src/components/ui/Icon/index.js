import React from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';

/**
 * @param {string} label
 * @param {string} viewBox
 * @param {string} icon
 *
 * @return jsx
 */
const Icon = ({ label = '', viewBox = '', icon }) => (
  <>
    <svg className={styles.svg} viewBox={viewBox}>
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
    {label && <span className={styles.label}>{label}</span>}
  </>
);

Icon.propTypes = {
  label: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default Icon;
