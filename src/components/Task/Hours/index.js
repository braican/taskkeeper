import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { className } from '../../../utils';
import { TaskContext } from '../index';

import styles from './Hours.module.scss';

const Hours = ({ value, onChange, className: wrapperClassName }) => {
  const initialValue = parseFloat(value);
  const { handleSave, handleInputFocus } = useContext(TaskContext);
  const [isSaving, setIsSaving] = useState(false);
  const [hours, setHours] = useState(value);

  const handleBlur = () => {
    if (typeof handleSave !== 'function') {
      return;
    }

    const newHours = parseFloat(hours);
    const shouldSave = newHours !== initialValue;

    setIsSaving(true);

    handleSave({ hours: newHours }, shouldSave).then(() => {
      setIsSaving(false);
    });
  };

  const handleChange = event => {
    const newHours = parseFloat(event.target.value);

    setHours(newHours);

    if (typeof onChange === 'function') {
      onChange(newHours);
    }
  };

  return (
    <div {...className(wrapperClassName, styles.hours)}>
      {value && value !== 0 ? (
        <>
          <input
            type="number"
            className={styles.hours__input}
            defaultValue={value}
            min="0"
            step="0.01"
            onFocus={handleInputFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSaving}
          />
          <span className={styles.hours__label}>&nbsp;hours</span>
        </>
      ) : null}
    </div>
  );
};

Hours.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

Hours.defaultProps = {
  value: null,
  onChange: null,
  className: null,
};

export default Hours;
