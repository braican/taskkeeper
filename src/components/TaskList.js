
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';


const TaskList = (props) => {
    let taskIndex = 0;

    return (
        <div>
            <div className="task task--key">
                <span className="task__description">Description</span>
                <span className="task__hours">Hours</span>
                <span className="task__price">Price</span>
            </div>
            <ul>
                {
                    props.tasks.map((task) => {
                        taskIndex += 1;
                        return (
                            <Task
                                hours={task.hours}
                                price={task.price}
                                rate={props.rate}
                                key={`${taskIndex}-${task.description}-${task.hours}`}
                            >
                                {task.description}
                            </Task>
                        );
                    })
                }
            </ul>
        </div>
    );
};

TaskList.propTypes = {
    tasks : PropTypes.array.isRequired,
    rate  : PropTypes.string.isRequired,
};


export default TaskList;
