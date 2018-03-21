import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

import { formatPrice, formatDate, getTasklistSubtotal } from '../helpers';


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
        const { invoice, rate } = this.props;
        const { tasks } = invoice;
        const invoiceAmount = getTasklistSubtotal(tasks, rate);

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
                            tasks.map((task) => (
                                <Task
                                    hours={task.hours}
                                    price={task.price}
                                    rate={rate}
                                    key={`${task.description}-${task.hours}`}
                                >
                                    {task.description}
                                </Task>
                            ))
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
