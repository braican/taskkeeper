import React from 'react';
import PropTypes from 'prop-types';
import { className } from '../../../utils';

import styles from './Inline.module.scss';

const InlineButton = ({ onClick, icon: Icon, label, className: propClassName, children }) => (
  <button {...className(styles.button, propClassName)} onClick={onClick}>
    {Icon && <Icon />}
    {label && <span className={styles.label}>{label}</span>}
    {children && <div>{children}</div>}
  </button>
);

InlineButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

InlineButton.defaultProps = {
  onClick: null,
  icon: null,
  label: null,
  className: null,
  children: null,
};

export default InlineButton;
