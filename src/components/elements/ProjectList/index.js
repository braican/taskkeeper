import React from 'react';
import { useProjects } from 'hooks';

import styles from './ProjectList.module.scss';

const ProjectList = () => {
  const { clientProjects } = useProjects();

  // eslint-disable-next-line
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
        {clientProjects.map(project => (
          <li key={project.id} className={styles.project}>
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
