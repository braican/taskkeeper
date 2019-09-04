import React, { useContext } from 'react';

import { TaskContext } from '../../Task';
import { task } from '../../../utils/status';

import CircleButton from '../../Buttons/Circle';
import MinusIcon from '../../../svg/Minus';

const TaskUtility = () => {
  const { taskRef } = useContext(TaskContext);

  const handleUncomplete = () => {
    if (!taskRef) {
      return;
    }

    taskRef.update({ status: task.ESTIMATED });
  };

  return (
    <>
      <CircleButton onClick={handleUncomplete} icon={MinusIcon} bg="red" label="Incomplete" />
    </>
  );
};

export default TaskUtility;
