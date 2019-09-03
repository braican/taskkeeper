import React from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';

const CompletedTasks = ({ tasks }) => {
  const noTasks = (
    <p>
      No outstanding tasks{' '}
      <span className="emoji" role="img" aria-label="Nice work">
        🌮
      </span>
    </p>
  );

  return <Tasklist headline="Completed Tasks" tasks={tasks} noTasksMessage={noTasks} />;
};

CompletedTasks.defaultProps = {
  tasks: [],
};

CompletedTasks.propTypes = {
  tasks: PropTypes.array,
};

export default CompletedTasks;
