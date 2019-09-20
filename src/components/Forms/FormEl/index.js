import React from 'react';
import PropTypes from 'prop-types';
import { className } from '../../../utils';
import styles from './FormEl.module.scss';

const FormEl = ({
  id,
  type,
  label,
  value,
  onChange,
  absoluteLabel,
  className: propClassName,
  inputConfig,
}) => (
  <div {...className(styles.formEl, propClassName, absoluteLabel && styles.absoluteLabel)}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    {'textarea' === type ? (
      <textarea id={id} {...inputConfig} value={value} onChange={onChange} />
    ) : (
      <input type={type} id={id} {...inputConfig} value={value} onChange={onChange} />
    )}
  </div>
);

FormEl.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  absoluteLabel: PropTypes.bool,
  className: PropTypes.string,
  inputConfig: PropTypes.object,
};

FormEl.defaultProps = {
  type: 'text',
  label: null,
  value: undefined,
  onChange: null,
  absoluteLabel: false,
  className: null,
  inputConfig: {},
};

export default FormEl;
