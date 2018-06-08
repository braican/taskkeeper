
import React from 'react';
import PropTypes from 'prop-types';

import { getTaskPrice, formatPrice } from '../helpers';


class Task extends React.Component {
    constructor() {
        super();

        this.editTask = this.editTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.renderTaskInput = this.renderTaskInput.bind(this);
        this.renderEditActions = this.renderEditActions.bind(this);

        this.state = {
            isSelected  : false,
            editingTask : false,
        };
    }

    /**
     * A Task has been selected or unselected
     */
    changeSelectedState() {
        const newSelectedState = !this.state.isSelected;
        this.setState({ isSelected : newSelectedState });
        this.props.updateSelectedTasks(this.props.taskIndex, newSelectedState);
    }


    /**
     * Edit the task
     */
    editTask(event) {
        event.preventDefault();
        this.setState({
            editingTask : true,
        });
    }


    removeTask() {
        this.props.removeTask(this.props.taskIndex);

        this.setState({
            editingTask : false,
        });
    }


    saveTask() {
        const newTask = {
            description : this.new_description.value,
        };

        if (this.new_hours) newTask.hours = this.new_hours.value;
        if (this.new_price) newTask.price = this.new_price.value;

        this.setState({
            editingTask : false,
        });

        this.props.saveTask(this.props.taskIndex, newTask);
    }


    /**
     * Renders the selectable functionality into the Task
     */
    renderSelectable() {
        return (
            <label className="task__selector" htmlFor={`task-${this.props.taskIndex}`}>
                <input
                    type="checkbox"
                    id={`task-${this.props.taskIndex}`}
                    onChange={(e) => this.changeSelectedState(e)}
                />
                <span className="task__selectorlabel" />
            </label>
        );
    }


    /**
     * Render the editable input for the task
     * @param {string} value The default value for the input
     * @param {string} id An ID for the input
     */
    renderTaskInput(value, id, inputType = 'text') {
        const inputClass = `taskedit taskedit--${id}${this.state.editingTask ? ' taskedit--visible' : ''}`;
        const inputStep = inputType === 'number' ? 'any' : null;
        const varName = `new_${id}`;
        return (
            <div className={inputClass}>
                <input
                    ref={(input) => { this[varName] = input; }}
                    type={inputType}
                    defaultValue={value}
                    step={inputStep}
                />
            </div>
        );
    }


    /**
     * Render the save/remove task buttons
     */
    renderEditActions() {
        if (!this.removeTask || !this.saveTask) return null;

        return (
            <div className="taskactions">
                <button onClick={this.saveTask} className="taskaction taskaction--save"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.22 18.56"><path d="M24.22,3.63a1.52,1.52,0,0,1-.44,1.06L10.34,18.13a1.52,1.52,0,0,1-2.12,0L.44,10.34a1.5,1.5,0,0,1,0-2.12L2.56,6.09a1.53,1.53,0,0,1,2.13,0L9.28,10.7,19.53.44A1.52,1.52,0,0,1,20.59,0a1.56,1.56,0,0,1,1.07.44l2.12,2.12a1.54,1.54,0,0,1,.44,1.07Z" fill="#00844f" /></svg></button>
                <button onClick={this.removeTask} className="taskaction taskaction--remove"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.56 18.56"><path d="M18.56,14.94A1.47,1.47,0,0,1,18.12,16L16,18.12a1.5,1.5,0,0,1-2.12,0l-4.6-4.59L4.69,18.12a1.51,1.51,0,0,1-2.13,0L.44,16a1.5,1.5,0,0,1,0-2.12L5,9.28.44,4.69A1.52,1.52,0,0,1,0,3.63,1.54,1.54,0,0,1,.44,2.56L2.56.44a1.51,1.51,0,0,1,2.13,0L9.28,5,13.88.44A1.5,1.5,0,0,1,16,.44l2.12,2.12a1.5,1.5,0,0,1,.44,1.07,1.47,1.47,0,0,1-.44,1.06L13.53,9.28l4.59,4.6A1.47,1.47,0,0,1,18.56,14.94Z" fill="#c00" /></svg></button>
            </div>
        );
    }

    render() {
        const {
            hours,
            rate,
            price,
            editable,
        } = this.props;
        const description = this.props.children;
        const taskPrice = getTaskPrice(hours, price, rate);
        const formattedPrice = formatPrice(taskPrice);
        const editHandler = editable ? this.editTask : null;

        if (!editable) {
            return (
                <li className="task">
                    <span className="task__description">{description}</span>
                    <span className="task__hours">{hours || '-'}</span>
                    <span className="task__price">{formattedPrice}</span>
                </li>
            );
        }

        return (
            <li className={`task${this.state.isSelected ? ' task--selected' : ''}`}>
                <div className="task__description">
                    <button className="task__clickable" onClick={editHandler}>
                        {description}
                    </button>
                    {this.renderTaskInput(description, 'description')}
                </div>

                <div className="task__hours">
                    <button className="task__clickable" onClick={editHandler}>
                        {hours || '-'}
                    </button>
                    {hours ? this.renderTaskInput(hours, 'hours', 'number') : null}
                </div>

                <div className="task__price">
                    <button className="task__clickable" onClick={editHandler}>
                        {formattedPrice}
                    </button>
                    {!hours ? this.renderTaskInput(taskPrice, 'price', 'number') : null}
                </div>

                {this.renderSelectable()}
                {this.state.editingTask ? this.renderEditActions() : null}
            </li>
        );
    }
}

Task.propTypes = {
    children            : PropTypes.string,
    hours               : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price               : PropTypes.string,
    rate                : PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    editable            : PropTypes.bool,
    taskIndex           : PropTypes.string.isRequired,
    updateSelectedTasks : PropTypes.func,
    saveTask            : PropTypes.func,
    removeTask          : PropTypes.func,
};

Task.defaultProps = {
    children            : '',
    hours               : 0,
    price               : null,
    editable            : false,
    updateSelectedTasks : null,
    saveTask            : null,
    removeTask          : null,
};

export default Task;
