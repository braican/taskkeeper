import React from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';
import CircleButton from '../../Buttons/Circle';
import CompleteIcon from '../../../svg/Complete';

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
  const taskUtility = <CircleButton onClick={() => console.log('test')} icon={CompleteIcon} />;

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
