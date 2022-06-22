import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, ProjectContext } from 'hooks';
import { cancellablePromise } from 'util/index';

const ProjectProvider = ({ children }) => {
  const { post } = useAuth();
  const [projects, setProjects] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      const cancelFetch = cancellablePromise(function* () {
        const { projects } = yield post('getProjects');
        setProjects(projects);
        setFetched(true);
      }, 'projectFetch');

      return () => {
        cancelFetch();
      };
    }
  }, []);

  const addProject = newProject => {
    const newProjects = [...projects, newProject];
    setProjects(newProjects);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>{children}</ProjectContext.Provider>
  );
};

ProjectProvider.propTypes = {
  children: PropTypes.node,
};

export default ProjectProvider;
