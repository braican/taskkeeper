
import React from 'react';

/**
 * Format the price
 * @param {number} price A price, in dollars and cents
 */
export function formatPrice(price) {
    if (!price) {
        return null;
    }

    const priceNumber = parseFloat(price);
    const priceString = priceNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const dollars = priceString.slice(0, priceString.length - 2).replace('.', '');
    const cents = priceString.slice(-2);

    return (
        <span>${dollars}<span className="cents">{cents}</span></span>
    );
}


/**
 * Formats a date
 * @param {string} date The date to format
 */
export function formatDate(date) {
    return date;
}


//
// INDIVIDUAL TASKS
//


/**
 * Gets an individual cost of a task
 * @param {number} hours Number of hours the task took, if it was an hourly task
 * @param {number} price Price of a task, if it is a one-off task
 * @param {number} rate The billing rate for the client
 */
export function getTaskPrice(hours, price, rate) {
    if (price !== null && price !== undefined) {
        return price;
    }

    return hours * rate;
}

/**
 * Gets the total amount due given the tasks
 * @param {object} tasks The tasks to check
 * @param {number} rate The billing rate for the client
 * @param {boolean} format Whether to format the price or not
 * @return int
 */
export function getTasklistSubtotal(tasks, rate, format = false) {
    if (!tasks) {
        return format ? formatPrice(0) : 0;
    }

    const subtotal = Object.keys(tasks).reduce((total, taskId) => {
        const task = tasks[taskId];
        const taskPrice = getTaskPrice(task.hours, task.price, rate);
        return total + parseFloat(taskPrice);
    }, 0);

    return format ? formatPrice(subtotal) : subtotal;
}


/**
 * Get the total price for each invoice
 * @param {object} invoices A bunch of invoices as objects
 * @param {number} rate The hourly rate to calculate the total for
 */
export function getInvoicegroupTotal(invoices, rate, format = false) {
    const subtotal = Object.keys(invoices).reduce((total, invoiceId) => {
        const invoice = invoices[invoiceId];

        if (!invoice.tasks) {
            return total;
        }

        return total + getTasklistSubtotal(invoice.tasks, rate, false);
    }, 0);

    return format ? formatPrice(subtotal) : subtotal;
}
