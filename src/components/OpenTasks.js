
import React from 'react';
import PropTypes from 'prop-types';

import TaskList from './TaskList';


class OpenTasks extends React.Component {
    constructor(props) {
        super();

        this.updateSelectedTasks = this.updateSelectedTasks.bind(this);

        this.state = {
            interactiveMode : false,
            selectedTasks   : props.tasks,
        };
    }

    /**
     * Trigger interactive task mode to select specific tasks to invoice
     * @param {Object} event Event data
     */
    enableTaskSelector(event) {
        event.preventDefault();
        this.setState({
            interactiveMode : true,
            selectedTasks   : {},
        });
    }


    /**
     * Disable the selectable Tasks mode
     * @param {object} event Event data
     */
    cancelTaskSelector(event) {
        if (event) event.preventDefault();
        this.setState({
            interactiveMode : false,
            selectedTasks   : this.props.tasks,
        });
    }


    /**
     * Submit the invoice
     * @param {Object} event Event data
     */
    submitTasksForInvoice(event) {
        event.preventDefault();
        this.props.submitInvoice(this.state.selectedTasks);
        this.cancelTaskSelector();
    }


    /**
     * When a task is selected, update the selected tasks state
     * @param {number} taskIndex Array index of the task
     * @param {boolean} status Whether the Task is selected or not
     */
    updateSelectedTasks(taskIndex, status) {
        const selected = { ...this.state.selectedTasks };

        if (status) {
            selected[taskIndex] = this.props.tasks[taskIndex];
        } else {
            delete selected[taskIndex];
        }

        this.setState({
            selectedTasks : selected,
        });
    }


    /**
     * Render the submit invoice button
     */
    renderSubmitInvoiceBtn() {
        if (this.state.interactiveMode) {
            return (
                <div className="l-container l-space-top l-align-right">
                    <button
                        className="tk-btn tk-btn--submit"
                        onClick={(e) => this.submitTasksForInvoice(e)}
                    >
                        Submit invoice
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={(e) => this.cancelTaskSelector(e)}>Cancel</button>
                </div>
            );
        }

        return (
            <div className="l-container l-space-top l-align-right">
                <button
                    className="tk-btn tk-btn--secondary"
                    onClick={(e) => this.enableTaskSelector(e)}
                >
                    Choose tasks to invoice
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button
                    className="tk-btn tk-btn--submit"
                    onClick={(e) => this.submitTasksForInvoice(e)}
                >
                    Submit all for invoice
                </button>
            </div>
        );
    }


    render() {
        const notasksCopy = 'You have no billable tasks for this client.';
        const taskCount = Object.keys(this.props.tasks).length;

        return (
            <section className={`client__opentasks${this.state.interactiveMode ? ' client__opentasks--interactive' : ''}`}>
                <div className="opentasks">
                    <div className="l-container">
                        {
                            taskCount > 0 ?
                                <TaskList
                                    tasks={this.props.tasks}
                                    rate={this.props.rate}
                                    editable
                                    updateSelectedTasks={this.updateSelectedTasks}
                                /> :
                                <p>{notasksCopy}</p>
                        }
                    </div>
                </div>

                {taskCount > 0 ? this.renderSubmitInvoiceBtn() : null}
            </section>
        );
    }
}

OpenTasks.propTypes = {
    tasks         : PropTypes.object,
    rate          : PropTypes.string.isRequired,
    submitInvoice : PropTypes.func.isRequired,
};

OpenTasks.defaultProps = {
    tasks : {},
};

export default OpenTasks;
