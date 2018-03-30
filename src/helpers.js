
import React from 'react';

/**
 * Format the price
 * @param {number} price A price, in dollars and cents
 */
export function formatPrice(price) {
    if (!price) {
        return null;
    }

    const priceNumber = parseInt(price, 10);
    const priceString = priceNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const dollars = priceString.slice(0, priceString.length - 2).replace('.', '');
    const cents = priceString.slice(-2);

    return (
        <span>${dollars}<span className="cents">{cents}</span></span>
    );
}


/**
 * Formats a date
 * @param {String} date The date to format
 */
export function formatDate(date) {
    return date;
}


//
// INDIVIDUAL TASKS
//


/**
 * Gets an individual cost of a task
 * @param {Number} hours Number of hours the task took, if it was an hourly task
 * @param {Number} price Price of a task, if it is a one-off task
 * @param {Number} rate The billing rate for the client
 */
export function getTaskPrice(hours, price, rate) {
    if (price !== null && price !== undefined) {
        return price;
    }

    return hours * rate;
}

/**
 * Gets the total amount due given the tasks
 * @param {Array} tasks The tasks to check
 * @param {Number} rate The billing rate for the client
 * @param {Boolean} format Whether to format the price or not
 * @return int
 */
export function getTasklistSubtotal(tasks, rate, format = false) {
    if (!tasks) {
        return format ? formatPrice(0) : 0;
    }

    const subtotal = tasks.reduce((total, task) => {
        const taskPrice = getTaskPrice(task.hours, task.price, rate);        
        return total + parseFloat(taskPrice);
    }, 0);

    return format ? formatPrice(subtotal) : subtotal;
}
