import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Tasklist from '../Tasklist';
import TaskUtility from './TaskUtility';

const CompletedTasks = ({ tasks }) => {
  const [isInvoicing, setIsInvoicing] = useState(false);

  const noTasks = (
    <p>
      No outstanding tasks{' '}
      <span className="emoji" role="img" aria-label="Nice work">
        🌮
      </span>
    </p>
  );

  return (
    <>
      <Tasklist
        headline="Completed Tasks"
        tasks={tasks}
        noTasksMessage={noTasks}
        utility={TaskUtility}
        isInvoicing={isInvoicing}
      />

      <div>
        <button type="button" className="button" onClick={() => setIsInvoicing(true)}>
          Start an invoice
        </button>
      </div>
    </>
  );
};

CompletedTasks.defaultProps = {
  tasks: [],
};

CompletedTasks.propTypes = {
  tasks: PropTypes.array,
};

export default CompletedTasks;
