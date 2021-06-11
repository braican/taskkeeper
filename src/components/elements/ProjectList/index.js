import React from 'react';
import { useProjects } from 'hooks';
import ActiveProject from './ActiveProject';

import { PROJECT_STATUS } from 'constants.js';

import styles from './ProjectList.module.scss';

const ProjectList = () => {
  const { clientProjects } = useProjects();

  if (clientProjects.length < 1) {
    return (
      <div className={styles.projectWrap}>
        <p>No projects</p>
      </div>
    );
  }

  return (
    <div className={styles.projectWrap}>
      <ul className={styles.projectList}>
        {clientProjects
          .filter(({ status }) => status === PROJECT_STATUS.active)
          .map(project => (
            <li key={project.id} className={styles.project}>
              <ActiveProject color={project.color} name={project.name} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProjectList;
