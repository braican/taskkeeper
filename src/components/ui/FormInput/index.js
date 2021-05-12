import React from 'react';
import PropTypes from 'prop-types';

import styles from './FormInput.module.scss';

const FormInput = ({ label = '', type = 'text', name = '', placeholder = '', onChange = null }) => {
  const getInputType = () => {
    if (type === 'textarea') {
      return <textarea name={name} placeholder={placeholder} onChange={onChange} />;
    }

    return <input type={type} name={name} placeholder={placeholder} onChange={onChange} />;
  };
  return (
    <div className={styles.formEl}>
      <span className={styles.label}>{label}</span>
      <div className={styles.input}>{getInputType()}</div>
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormInput;