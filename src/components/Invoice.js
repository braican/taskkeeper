import React from 'react';
import PropTypes from 'prop-types';

import TaskList from './TaskList';

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
        const tasklist = invoice.tasks;
        const invoiceAmount = getTasklistSubtotal(tasklist, rate);

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
                    <TaskList tasks={tasklist} rate={rate} />
                </div>
            </div>
        );
    }
}


Invoice.propTypes = {
    invoice : PropTypes.object.isRequired,
    rate    : PropTypes.number.isRequired,
};

export default Invoice;
