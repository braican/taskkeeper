import React from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';

/**
 * @param {string} label
 * @param {string} viewBox
 * @param {string} icon
 * @param {boolean} inline
 *
 * @return jsx
 */
const Icon = ({ label = '', viewBox = '', icon, inline = false }) => (
  <div className={inline ? styles.inline : ''}>
    <svg className={styles.svg} viewBox={viewBox}>
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
    {label && <span className={styles.label}>{label}</span>}
  </div>
);

Icon.propTypes = {
  label: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired,
  inline: PropTypes.bool,
};

export default Icon;
