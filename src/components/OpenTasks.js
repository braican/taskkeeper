
import React from 'react';
import PropTypes from 'prop-types';

import TaskList from './TaskList';


const OpenTasks = (props) => {
    const notasksCopy = 'You have no billable tasks for this client.';
    const taskCount = props.tasks.length;

    const submitInvoice = (e) => {
        e.preventDefault();
        props.submitInvoice(props.tasks);
    };

    return (
        <section className="client__opentasks">
            <div className="l-container">
                {
                    taskCount > 0 ?
                        <TaskList tasks={props.tasks} rate={props.rate} /> :
                        <p>{notasksCopy}</p>
                }
            </div>

            {
                taskCount > 0 ?
                    <button onClick={(e) => submitInvoice(e)}>Submit invoice</button> :
                    null
            }
        </section>
    );
};

OpenTasks.propTypes = {
    tasks         : PropTypes.array,
    rate          : PropTypes.number.isRequired,
    submitInvoice : PropTypes.func.isRequired,
};

OpenTasks.defaultProps = {
    tasks : [],
};

export default OpenTasks;
