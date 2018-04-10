import React from 'react';
import PropTypes from 'prop-types';

import { getTasklistSubtotal } from '../helpers';

class TaskForm extends React.Component {
    constructor() {
        super();

        // binders
        this.toggleTaskQtyUnit = this.toggleTaskQtyUnit.bind(this);
        this.handleQtyInputChange = this.handleQtyInputChange.bind(this);

        this.state = {
            taskByPrice : false,
            description : '',
            qty         : '',
        };
    }

    addTask(event) {
        event.preventDefault();

        const taskHours = this.state.taskByPrice ? null : this.taskQty.value;
        const taskPrice = this.state.taskByPrice ? this.taskQty.value : null;

        if (this.taskDescription.value === '' && this.taskQty.value === '') {
            console.error('Please add a description and a cost or hours value to add a task.');
            return;
        }

        const task = {
            description : this.taskDescription.value,
            hours       : taskHours,
            price       : taskPrice,
        };

        this.props.addTask(task, this.props.clientKey);
        this.taskDescription.value = '';
        this.taskQty.value = '';
        this.setState({
            qty         : '',
            description : '',
        });
    }


    toggleTaskQtyUnit() {
        const unitByPrice = this.state.taskByPrice;
        this.setState({
            taskByPrice : !unitByPrice,
        });
    }


    handleQtyInputChange(event) {
        this.setState({
            qty : event.target.value,
        });
    }

    handleDescriptionInputChange(event) {
        this.setState({
            description : event.target.value,
        });
    }

    render() {
        const { taskByPrice, description, qty } = this.state;
        const { client } = this.props;
        const openTaskCost = getTasklistSubtotal(client.openTasks, client.rate, true);

        return (
            <form
                ref={(input) => { this.taskForm = input; }}
                onSubmit={(e) => this.addTask(e)}
                className="taskform l-container"
            >
                <header className="taskform__header">
                    <h3 className="taskform__title t-blocktitle">Open Tasks</h3>

                    <p className="moneydisplay">
                        {openTaskCost || <span>&nbsp;</span>}
                    </p>
                </header>

                <div className="taskform__fieldset">
                    <div className="taskform__el taskform__el--description">
                        <input
                            ref={(input) => { this.taskDescription = input; }}
                            type="text"
                            id="task-description"
                            onChange={(event) => this.handleDescriptionInputChange(event)}
                            className={`taskform__input ${description === '' ? '' : 'taskform__input--hasinput'}`}
                        />
                        <label className="taskform__label" htmlFor="task-description">Task</label>
                    </div>

                    <div className="taskform__el taskform__el--toggle">
                        <span className={`toggle__label${!taskByPrice ? ' toggle__label--active' : ''}`}>Hours</span>
                        <input
                            className="toggle__check"
                            id="task-unit-toggle"
                            type="checkbox"
                            onChange={this.toggleTaskQtyUnit}
                        />
                        <label htmlFor="task-unit-toggle" className="toggle__switch" />
                        <span className={`toggle__label${taskByPrice ? ' toggle__label--active' : ''}`}>Cost</span>
                    </div>

                    <div className={`taskform__el taskform__el--qty${taskByPrice ? ' taskform__el--byprice' : ''}`}>
                        <span className="taskform__dollarsign">$</span>
                        <input
                            ref={(input) => { this.taskQty = input; }}
                            type="number"
                            id="task-qty"
                            onChange={(event) => this.handleQtyInputChange(event)}
                            className={`taskform__input ${qty === '' ? '' : 'taskform__input--hasinput'}`}
                        />

                        <label
                            className="taskform__label taskform__label--hasoptions"
                            htmlFor="task-qty"
                        >
                            <span className={`taskform__labelswap${taskByPrice ? ' taskform__labelswap--hidden' : ''}`}>
                                Hours
                            </span>
                            <span className={`taskform__labelswap${!taskByPrice ? ' taskform__labelswap--hidden' : ''}`}>
                                Price
                            </span>
                        </label>
                    </div>

                    <div className="taskform__el taskform__el--actions">
                        <button className="taskform__submit">+</button>
                    </div>
                </div>
            </form>
        );
    }
}


TaskForm.propTypes = {
    clientKey : PropTypes.string.isRequired,
    client    : PropTypes.object.isRequired,
    addTask   : PropTypes.func.isRequired,
};

export default TaskForm;
