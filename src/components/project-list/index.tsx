import { Client, Project } from '@/types';
import ProjectItem from '@/components/project-item';
import styles from './project-list.module.css';

export default function ProjectList({
  projects,
  client,
}: {
  projects: Project[];
  client: Client;
}) {
  if (projects.length === 0) {
    return <p>No projects yet.</p>;
  }

  return (
    <ul className={`ul-reset ${styles.grid}`}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectItem project={project} client={client} />
        </li>
      ))}
    </ul>
  );
}
