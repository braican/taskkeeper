import React, { useState } from 'react';
import FormInput from 'components/ui/FormInput';

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
      {!formActive && <button onClick={() => setFormActive(true)}>Add Project</button>}

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
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setFormActive(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default AddProject;
