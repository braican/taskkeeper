'use client';

import { RecordModel } from 'pocketbase';
import pb from '@/lib/pocketbase';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';

interface ProjectContextType {
  areProjectsLoaded: boolean;
  projects: Project[];
  addProject: (projectData: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (projectData: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getClientProjects: (clientId: string) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const recordToProject = (record: RecordModel): Project => ({
  id: record.id,
  client: record.client,
  title: record.title,
  status: record.status || 'estimate',
  quotedCost: record.quotedCost || undefined,
  timeEstimate: record.timeEstimate || undefined,
  accruedTime: record.accruedTime || undefined,
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [areProjectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const [prevUser, setPrevUser] = useState(user);

  if (prevUser !== user) {
    setPrevUser(user);
    if (!user) {
      setProjects([]);
      setProjectsLoaded(false);
    }
  }

  useEffect(() => {
    if (!user) {
      hasFetchedRef.current = false;
      return;
    }
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    async function fetchProjects() {
      try {
        const records = await pb.collection('projects').getFullList();
        setProjectsLoaded(true);
        setProjects(records.map(recordToProject));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, [user]);

  const addProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    try {
      const record = await pb
        .collection('projects')
        .create({ ...projectData, user: user?.id });
      const project = recordToProject(record);
      setProjects((prev) => [...prev, project]);
      return project;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (projectData: Project) => {
    if (!projectData.id) return;
    try {
      await pb.collection('projects').update(projectData.id, projectData);
      setProjects((prev) =>
        prev.map((p) => (p.id !== projectData.id ? p : { ...p, ...projectData })),
      );
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await pb.collection('projects').delete(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const getClientProjects = (clientId: string): Project[] =>
    projects.filter((p) => p.client === clientId);

  return (
    <ProjectContext.Provider
      value={{
        areProjectsLoaded,
        projects,
        addProject,
        updateProject,
        deleteProject,
        getClientProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
