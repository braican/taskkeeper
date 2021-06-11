import React, { useState } from 'react';
import { useAuth, useClients, useProjects } from 'hooks';

import FormInput from 'components/ui/FormInput';
import Button from 'components/ui/Button';
import SecondaryButton from 'components/ui/SecondaryButton';
import Icon from 'components/ui/Icon';

import { PROJECT_STATUS } from 'constants.js';

import styles from './AddProject.module.scss';

const AddProject = () => {
  const [formActive, setFormActive] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [color, setColor] = useState('#000000');

  const { post } = useAuth();
  const { client } = useClients();
  const { addProject } = useProjects();

  const addProjectToDb = event => {
    event.preventDefault();

    if (!name) {
      return;
    }

    post('addProject', {
      project: {
        name,
        key: key || name.substring(0, 3).toUpperCase(),
        color,
        status: PROJECT_STATUS.active,
        client: client.id,
      },
    })
      .then(({ project }) => {
        setName('');
        setKey('');
        setColor('#000000');
        setFormActive(false);
        addProject(project);
      })
      .catch(console.error);
  };

  return (
    <div className={styles.addProject}>
      {!formActive && (
        <Button onClick={() => setFormActive(true)} style="transparent">
          <Icon icon="plus-square" />
          <span>Add project</span>
        </Button>
      )}

      {formActive && (
        <form onSubmit={addProjectToDb} className={styles.projectForm}>
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
              value={key}
              required
              onChange={event => setKey(event.target.value)}
            />

            <label className={styles.colorpickerWrap}>
              <span className={styles.colorpickerLabel}>Label color</span>
              <input
                type="color"
                defaultValue={color}
                className={styles.colorpicker}
                onBlur={event => setColor(event.target.value)}
              />
            </label>
          </div>
          <div className={styles.actions}>
            <Button type="submit">Save</Button>
            <SecondaryButton onClick={() => setFormActive(false)}>Cancel</SecondaryButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProject;
