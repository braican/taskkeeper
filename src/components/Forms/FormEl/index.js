import React from 'react';
import PropTypes from 'prop-types';

import styles from './FormEl.module.scss';

const FormEl = ({ id, type, label, value, onChange, className, inputConfig }) => (
  <div className={`${className ? className : ''} ${styles.formEl}`}>
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} {...inputConfig} value={value} onChange={onChange} />
  </div>
);

FormEl.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  inputConfig: PropTypes.object,
};

FormEl.defaultProps = {
  type: 'text',
  label: null,
  value: undefined,
  onChange: null,
  children: null,
  className: null,
  inputConfig: {},
};

export default FormEl;
