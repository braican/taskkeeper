import React from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';
import TaskUtility from './TaskUtility';

const CompletedTasks = ({ tasks }) => {
  const noTasks = (
    <p>
      No outstanding tasks{' '}
      <span className="emoji" role="img" aria-label="Nice work">
        🌮
      </span>
    </p>
  );

  return (
    <Tasklist
      headline="Completed Tasks"
      tasks={tasks}
      noTasksMessage={noTasks}
      utility={TaskUtility}
    />
  );
};

CompletedTasks.defaultProps = {
  tasks: [],
};

CompletedTasks.propTypes = {
  tasks: PropTypes.array,
};

export default CompletedTasks;
