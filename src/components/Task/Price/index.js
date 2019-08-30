import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { className } from '../../../utils';
import { TaskContext } from '../index';

import FormattedPrice from '../../Utils/FormattedPrice';

import styles from './Price.module.scss';

const Price = ({ isFixed, className: wrapperClassName }) => {
  const { taskRef, price, setPrice, handleSave } = useContext(TaskContext);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = () => {
    setEditing(false);

    const newPrice = parseFloat(price);

    setIsSaving(true);
    taskRef.update({ price: newPrice }).then(() => {
      setIsSaving(false);

      if (typeof handleSave === 'function') {
        handleSave();
      }
    });
  };

  return (
    <div
      {...className(wrapperClassName, styles.price__wrapper, isFixed && styles.price__isEditable)}>
      <span {...className(styles.price__val, editing && styles.price__valHide)}>
        <FormattedPrice price={price} />
      </span>

      {isFixed && (
        <input
          type="text"
          className={styles.fixedPriceInput}
          defaultValue={price}
          min="0"
          step="0.01"
          onChange={event => setPrice(event.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={handleChange}
          disabled={isSaving}
        />
      )}
    </div>
  );
};

Price.propTypes = {
  isFixed: PropTypes.bool,
  className: PropTypes.string,
};

Price.defaultProps = {
  isFixed: false,
  className: null,
};

export default Price;
