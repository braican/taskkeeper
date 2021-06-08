import React, { useState } from 'react';
import FormInput from 'components/ui/FormInput';

import Button from 'components/ui/Button';
import SecondaryButton from 'components/ui/SecondaryButton';
import Icon from 'components/ui/Icon';

import styles from './AddProject.module.scss';

const AddProject = () => {
  const [formActive, setFormActive] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
  };

  const handleSave = () => {};

  return (
    <div>
      {!formActive && (
        <Button onClick={() => setFormActive(true)} style="transparent">
          <Icon icon="plus-square" />
          <span>Add project</span>
        </Button>
      )}

      {formActive && (
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <div className={styles.formInputs}>
            <FormInput
              label="Project name"
              name="project_name"
              value={name}
              required
              onChange={event => setName(event.target.value)}
            />
            <FormInput
              label="Key"
              name="project_key"
              value={name}
              required
              onChange={event => setName(event.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <Button onClick={handleSave}>Save</Button>
            <SecondaryButton onClick={() => setFormActive(false)}>Cancel</SecondaryButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProject;
