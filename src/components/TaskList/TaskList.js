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
        this.props.taskRef.where('client', '==', this.props.clientKey).onSnapshot(snapshot => {
            const newTasks = [];

            snapshot.forEach(doc => {
                const newTask = doc.data();
                newTask.taskId = doc.id;
                newTasks.push(newTask);
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
