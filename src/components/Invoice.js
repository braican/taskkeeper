import React from 'react';
import PropTypes from 'prop-types';

import { formatPrice, formatDate } from '../helpers';


/**
 * Gets an individual cost of a task
 * @param {Object} task The task to get the cost of
 * @param {Number} rate The billing rate for the client
 */
function getTaskPrice(task, rate) {
    if (task.price !== null) {
        return task.price;
    }

    return task.hours * rate;
}


/**
 * Gets the total amount due given the tasks
 * @param {Array} tasks The tasks to check
 * @param {Number} rate The billing rate for the client
 * @return int
 */
function getTotalPrice(tasks, rate) {
    return tasks.reduce((total, task) => {
        const taskPrice = getTaskPrice(task, rate);
        return total + taskPrice;
    }, 0);
}


/**
 * Renders a single task
 * @param {Object} task The task
 * @param {String} id ID for the task element
 * @param {Number} rate The billing rate for the client
 */
function renderSingleTask(task, id, rate) {
    const hours = task.hours || '-';

    return (
        <li key={id} className="task">
            <span className="task__description">
                {task.description}
            </span>
            <span className="task__hours">
                {hours}
            </span>
            <span className="task__price">
                {formatPrice(getTaskPrice(task, rate))}
            </span>
        </li>
    );
}


class Invoice extends React.Component {
    constructor(props) {
        super();

        const isActive = props.invoice.status === 'active';

        // binders
        this.toggleTasklist = this.toggleTasklist.bind(this);

        this.state = {
            tasksOpen : isActive,
        };
    }


    toggleTasklist() {
        const drawerStatus = this.state.tasksOpen;
        this.setState({
            tasksOpen : !drawerStatus,
        });
    }


    render() {
        const { invoice, index, rate } = this.props;
        const { tasks } = invoice;
        const invoiceAmount = getTotalPrice(tasks, rate);

        return (
            <div className="invoice">
                <header className="invoice__header">
                    <div className="invoice__date">
                        <p>{formatDate(invoice.invoicedate)}</p>
                        <button
                            className={`tasklist__trigger${this.state.tasksOpen ? ' tasklist__trigger--close' : ''}`}
                            onClick={this.toggleTasklist}
                        >
                            Tasklist
                        </button>
                    </div>
                    <p className="invoice__price">{formatPrice(invoiceAmount)}</p>
                </header>

                <div className={`invoice__tasks${this.state.tasksOpen ? ' invoice__tasks--expanded' : ''}`}>
                    <div className="invoice__key">
                        <div className="task task--key">
                            <span className="task__description">Description</span>
                            <span className="task__hours">Hours</span>
                            <span className="task__price">Price</span>
                        </div>
                    </div>
                    <ul className="invoice__tasklist">
                        {
                            tasks.map((task, taskIndex) =>
                                renderSingleTask(task, `${index}-${taskIndex}`, rate))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}


Invoice.propTypes = {
    invoice : PropTypes.object.isRequired,
    index   : PropTypes.string.isRequired,
    rate    : PropTypes.number.isRequired,
};

export default Invoice;
