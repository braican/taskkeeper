
import React from 'react';
import PropTypes from 'prop-types';

import { getTaskPrice, formatPrice } from '../helpers';


class Task extends React.Component {
    constructor() {
        super();

        this.state = {
            isSelected         : false,
            editingDescription : false,
            editingHours       : false,
        };
    }

    /**
     * A Task has been selected or unselected
     */
    changeSelectedState(e) {
        const newSelectedState = !this.state.isSelected;
        this.setState({ isSelected : newSelectedState });
        this.props.updateSelectedTasks(this.props.taskIndex, newSelectedState);
    }


    /**
     * Edit the description
     */
    editDescription() {
        
        
    }


    /**
     * Renders the editable functionality into the Task
     */
    renderEditable() {
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

    render() {
        const { hours, rate, price, editable } = this.props;
        const description = this.props.children;
        const formattedPrice = formatPrice(getTaskPrice(hours, price, rate));

        const descriptionHandler = editable ? this.editDescription : null;

        return (
            <li className={`task${this.state.isSelected ? ' task--selected' : ''}`}>
                <button className="task__description" onClick={descriptionHandler}>
                    {description}
                    {
                        editable ?
                            <input className={`taskedit${this.state.editingDescription ? ' taskedit--visible' : ''}`} type="text" /> :
                            null
                    }
                </button>
                <button className="task__hours">{hours || '-'}</button>
                <span className="task__price">{formattedPrice}</span>
                {editable && this.updateSelectedTasks !== null ? this.renderEditable() : null}
            </li>
        );
    }
}

Task.propTypes = {
    children            : PropTypes.string,
    hours               : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price               : PropTypes.string,
    rate                : PropTypes.string.isRequired,
    editable            : PropTypes.bool,
    taskIndex           : PropTypes.string,
    updateSelectedTasks : PropTypes.func,
};

Task.defaultProps = {
    children            : '',
    hours               : 0,
    price               : null,
    editable            : false,
    taskIndex           : 0,
    updateSelectedTasks : null,
};

export default Task;
