import React from 'react';
import PropTypes from 'prop-types';

class TaskForm extends React.Component {
    constructor() {
        super();

        this.state = {
            description: '',
            hours: 0,
            price: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addNewTask(event) {
        event.preventDefault();
        if (!this.props.taskRef) {
            return;
        }

        const task = { ...this.state };
        task.client = this.props.clientKey;
        this.props.taskRef.push(task);
        this.taskForm.reset();
        this.setState({
            description: '',
            hours: 0,
            price: 0
        });
    }

    render() {
        return (
            <form
                className="new-task"
                ref={input => {
                    this.taskForm = input;
                }}
                onSubmit={this.addNewTask}
            >
                <input
                    type="text"
                    name="description"
                    onChange={this.handleChange}
                    value={this.state.description}
                />
                <input
                    type="number"
                    name="hours"
                    onChange={this.handleChange}
                    value={this.state.hours}
                />
                <button>Add</button>
            </form>
        );
    }
}

TaskForm.propTypes = {
    taskRef: PropTypes.object,
    clientKey: PropTypes.string.isRequired
};

TaskForm.defaultProps = {
    taskRef: null
};

export default TaskForm;
