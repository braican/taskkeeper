import React from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';
import CompleteButton from '../../Buttons/Complete';

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
  const taskUtility = <CompleteButton onClick={() => console.log('test')} />;

  return (
    <Tasklist
      headline="Estimated Tasks"
      tasks={tasks}
      noTasksMessage={noTasks}
      taskUtility={taskUtility}
    />
  );
};

EstimatedTasks.defaultProps = {
  tasks: [],
};

EstimatedTasks.propTypes = {
  tasks: PropTypes.array,
};

export default EstimatedTasks;
