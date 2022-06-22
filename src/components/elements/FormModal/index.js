import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/Button';
import SecondaryButton from 'components/ui/SecondaryButton';

import styles from './FormModal.module.scss';

const FormModal = ({ children, headline = '', onSubmit = null, onCancel = null }) => {
  const formEl = useRef();

  useEffect(() => {
    if (formEl.current) {
      formEl.current.querySelector('textarea, input')?.focus();
    }
  }, []);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
      className={styles.form}
      ref={formEl}>
      {headline && <h3 className={styles.headline}>{headline}</h3>}

      {children}

      <div className={styles.actions}>
        <Button type="submit">Add</Button>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </form>
  );
};

FormModal.propTypes = {
  children: PropTypes.node,
  headline: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FormModal;
