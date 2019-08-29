import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { className } from '../../../utils';

import styles from './Toggler.module.scss';

const Toggler = ({ on, off, onChange }) => {
  const [isOn, setOn] = useState(false);

  const handleChange = isChecked => {
    setOn(isChecked);

    if (typeof onChange === 'function') {
      onChange(isChecked);
    }
  };

  return (
    <div className={styles.toggler}>
      <button
        type="button"
        {...className(styles.label, isOn && styles.labelDisabled)}
        tabIndex="-1"
        onClick={() => handleChange(false)}>
        {off}
      </button>

      <input
        type="checkbox"
        className={styles.control}
        id="toggler-toggle"
        checked={isOn}
        onChange={e => handleChange(e.target.checked)}
      />
      <label htmlFor="toggler-toggle" className={styles.track}>
        &nbsp;
      </label>

      <button
        type="button"
        {...className(styles.label, !isOn && styles.labelDisabled)}
        tabIndex="-1"
        onClick={() => handleChange(true)}>
        {on}
      </button>
    </div>
  );
};

Toggler.propTypes = {
  on: PropTypes.string,
  off: PropTypes.string,
  onChange: PropTypes.func,
};

Toggler.defaultProps = {
  on: 'On',
  off: 'Off',
  onChange: null,
};

export default Toggler;
