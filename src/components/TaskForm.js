import React from 'react';
import PropTypes from 'prop-types';

// import { formatPrice } from '../helpers';


class TaskForm extends React.Component {
    addTask(event) {
        event.preventDefault();

        const task = {
            description : this.taskDescription.value,
            hours       : this.taskHours.value,
        };

        this.props.addTask(task, this.props.clientKey);
        this.taskForm.reset();
    }

    render() {
        return (
            <form ref={(input) => { this.taskForm = input; }} onSubmit={(e) => this.addTask(e)}>
                <input ref={(input) => { this.taskDescription = input; }} type="text" />
                <input ref={(input) => { this.taskHours = input; }} type="number" />
                <button>+</button>
            </form>
        );
    }
}


TaskForm.propTypes = {
    clientKey : PropTypes.string.isRequired,
    addTask   : PropTypes.func.isRequired,
};

export default TaskForm;
