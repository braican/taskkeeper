import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './FormInput.module.scss';

const FormInput = ({
  value = '',
  defaultValue = '',
  label = '',
  type = 'text',
  name = '',
  placeholder = '',
  onChange = null,
  onBlur = null,
  required = false,
  className = '',
}) => {
  const [focused, setFocused] = useState(value !== '');

  const inputProps = {
    name,
    placeholder,
    onChange,
    value,
    required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(value !== ''),
  };

  if (type === 'color') {
    return (
      <input
        className={styles.colorpicker}
        type="color"
        defaultValue={defaultValue}
        onBlur={onBlur}
      />
    );
  }

  const getInputType = () => {
    if (type === 'textarea') {
      return <textarea {...inputProps} />;
    }

    return <input type={type} {...inputProps} />;
  };

  return (
    <div className={classnames(styles.formEl, className, focused && styles.formElFocused)}>
      <span className={styles.label}>{label}</span>
      <div className={styles.input}>{getInputType()}</div>
    </div>
  );
};

FormInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default FormInput;
