import React from 'react';
import PropTypes from 'prop-types';

import styles from './FormEl.module.scss';

const FormEl = ({ type, label, id, className, inputConfig }) => (
  <div className={`${className ? className : ''} ${styles.formEl}`}>
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} {...inputConfig} />
  </div>
);

FormEl.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  inputConfig: PropTypes.object,
};

FormEl.defaultProps = {
  type: 'text',
  label: null,
  children: null,
  className: null,
  inputConfig: {},
};

export default FormEl;
