import React from 'react';
import PropTypes from 'prop-types';

import TaskList from './TaskList';

import { formatDate, getTasklistSubtotal } from '../helpers';


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


    /**
     * Opens and closes the task list
     */
    toggleTasklist() {
        const drawerStatus = this.state.tasksOpen;
        this.setState({
            tasksOpen : !drawerStatus,
        });
    }


    renderPaidBtn() {
        return (
            <div>
                <button
                    className="tk-btn tk-btn--paid"
                    onClick={() => this.props.archiveInvoice(this.props.invoiceId)}
                >
                    Paid
                </button>
            </div>
        );
    }


    render() {
        const { invoice, rate } = this.props;
        const tasklist = invoice.tasks;
        const invoiceAmount = getTasklistSubtotal(tasklist, rate, true);

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

                    {invoice.status === 'active' ? this.renderPaidBtn() : null}

                    <p className="invoice__price moneydisplay moneydisplay--small">
                        {invoiceAmount}
                    </p>
                </header>

                <div className={`invoice__tasks${this.state.tasksOpen ? ' invoice__tasks--expanded' : ''}`}>
                    <TaskList tasks={tasklist} rate={rate} />
                </div>
            </div>
        );
    }
}


Invoice.propTypes = {
    invoiceId      : PropTypes.string.isRequired,
    invoice        : PropTypes.object.isRequired,
    rate           : PropTypes.string.isRequired,
    archiveInvoice : PropTypes.func.isRequired,
};

Invoice.defaultProps = {
    saveTask   : null,
    removeTask : null,
}

export default Invoice;
