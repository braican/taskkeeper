import React, { useContext } from 'react';
import { ClientContext } from '../index';

const EstimatedTasks = () => {
  const { estimatedTasks } = useContext(ClientContext);

  console.log(estimatedTasks);

  return <h2>all tasks</h2>;
};

export default EstimatedTasks;
