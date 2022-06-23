import { createContext, useContext } from 'react';
import { useClients } from 'hooks/index.js';

export const ProjectContext = createContext({
  /** @var array */
  projects: [],

  /** @var array */
  clientProjects: [],
});

const useProjects = () => {
  const projectData = useContext(ProjectContext);
  const { client } = useClients();
  const clientProjects = projectData.projects.filter(t => t.client === client.id);

  return { ...projectData, clientProjects };
};

export default useProjects;
