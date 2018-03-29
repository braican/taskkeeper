
import React from 'react';
import PropTypes from 'prop-types';

import TaskList from './TaskList';



const OpenTasks = (props) => {
    const notasksCopy = 'You have no billable tasks for this client.';
    const taskCount = props.tasks.length;

    /**
     * Submit the invoice
     * @param {Object} e Event data
     */
    const submitInvoice = (e) => {
        e.preventDefault();
        props.submitInvoice(props.tasks);
    };

    /**
     * Render the submit invoice button
     */
    const renderSubmitInvoiceBtn = () => (
        <div className="l-container l-space-top l-align-right">
            <button className="tk-btn tk-btn--submit" onClick={(e) => submitInvoice(e)}>Submit invoice</button>
        </div>
    );

    return (
        <section className="client__opentasks">
            <div className="opentasks">
                <div className="l-container">
                    {
                        taskCount > 0 ?
                            <TaskList tasks={props.tasks} rate={props.rate} /> :
                            <p>{notasksCopy}</p>
                    }
                </div>
            </div>

            {taskCount > 0 ? renderSubmitInvoiceBtn() : null}
        </section>
    );
};

OpenTasks.propTypes = {
    tasks         : PropTypes.array,
    rate          : PropTypes.number.isRequired,
    submitInvoice : PropTypes.func.isRequired,
};

OpenTasks.defaultProps = {
    tasks : [],
};

export default OpenTasks;
