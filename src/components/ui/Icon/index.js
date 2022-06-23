import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Icon.module.scss';

/**
 * @param {string} label
 * @param {string} viewBox
 * @param {string} icon
 * @param {boolean} inline
 *
 * @return jsx
 */
const Icon = ({ label = '', viewBox = '0 0 20 20', icon, inline = false, className = '' }) => (
  <span className={classnames(inline ? styles.inline : '', className)}>
    <svg className={styles.svg} viewBox={viewBox}>
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
    {label && <span className={styles.label}>{label}</span>}
  </span>
);
Icon.propTypes = {
  label: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  className: PropTypes.string,
};

export default Icon;
