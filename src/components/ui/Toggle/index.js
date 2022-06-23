import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Toggle.module.scss';

const Toggle = ({ off, on, onChange }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={classnames(styles.label, !checked && styles.labelActive)}
        onClick={() => {
          if (checked === true) {
            setChecked(false);
            onChange();
          }
        }}>
        {off}
      </button>
      <label>
        <input
          type="checkbox"
          onChange={() => {
            setChecked(!checked);
            onChange();
          }}
          className={styles.input}
          checked={checked}
        />
        <span className={styles.track}></span>
      </label>
      <button
        type="button"
        className={classnames(styles.label, checked && styles.labelActive)}
        onClick={() => {
          if (checked !== true) {
            setChecked(true);
            onChange();
          }
        }}>
        {on}
      </button>
    </div>
  );
};

Toggle.propTypes = {
  off: PropTypes.string,
  on: PropTypes.string,
  onChange: PropTypes.func,
};

export default Toggle;
