
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';


const TaskList = (props) => (
    <div>
        <div className="task task--key">
            <span className="task__description">Description</span>
            <span className="task__hours">Hours</span>
            <span className="task__price">Price</span>
        </div>
        <ul>
            {
                Object.keys(props.tasks).map((taskId) => {
                    const task = props.tasks[taskId];
                    return (
                        <Task
                            key={taskId}
                            taskIndex={taskId}
                            hours={task.hours}
                            price={task.price}
                            rate={props.rate}
                            editable={props.editable}
                            updateSelectedTasks={props.updateSelectedTasks}
                        >
                            {task.description}
                        </Task>
                    );
                })
            }
        </ul>
    </div>
);

TaskList.propTypes = {
    tasks               : PropTypes.object.isRequired,
    rate                : PropTypes.string.isRequired,
    editable            : PropTypes.bool,
    updateSelectedTasks : PropTypes.func,
};

TaskList.defaultProps = {
    editable            : false,
    updateSelectedTasks : null,
};


export default TaskList;
