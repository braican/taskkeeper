import React from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';
import TaskUtility from './TaskUtility';

const EstimatedTasks = ({ tasks }) => {
  const noTasks = (
    <p>
      No estimated tasks{' '}
      <span className="emoji" role="img" aria-label="Nice work">
        🤘
      </span>
      .
    </p>
  );

  return (
    <Tasklist
      headline="Estimated Tasks"
      tasks={tasks}
      noTasksMessage={noTasks}
      utility={TaskUtility}
    />
  );
};

EstimatedTasks.propTypes = {
  tasks: PropTypes.array,
};

EstimatedTasks.defaultProps = {
  tasks: [],
};

export default EstimatedTasks;
