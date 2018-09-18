import React from 'react';
import PropTypes from 'prop-types';

class TaskList extends React.Component {
    constructor() {
        super();

        this.state = {
            tasks: []
        };
    }

    componentDidMount() {
        this.getTasks();
    }

    componentDidUpdate(prevProps) {
        if (this.props.clientKey !== prevProps.clientKey) {
            this.getTasks();
        }
    }

    getTasks() {
        this.props.taskRef
            .orderByChild('client')
            .equalTo(this.props.clientKey)
            .on('value', snapshot => {
                const tasks = snapshot.val();
                const newTasks = [];

                if (!tasks) {
                    return;
                }

                Object.keys(tasks).forEach(taskId => {
                    const task = tasks[taskId];
                    const { description, hours, price } = task;

                    newTasks.push({
                        taskId,
                        description,
                        hours,
                        price
                    });
                });

                this.setState({ tasks: newTasks });
            });
    }

    render() {
        return (
            <ul>
                {this.state.tasks.map(task => (
                    <li key={task.taskId}>
                        {task.description} - {task.hours} - {task.hours * this.props.rate}
                    </li>
                ))}
            </ul>
        );
    }
}

TaskList.propTypes = {
    taskRef: PropTypes.object,
    rate: PropTypes.number,
    clientKey: PropTypes.string
};

TaskList.defaultProps = {
    rate: 0,
    taskRef: null,
    clientKey: ''
};

export default TaskList;
