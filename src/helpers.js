
import React from 'react';

/**
 * Format the price
 * @param {number} price A price, in dollars and cents
 */
export function formatPrice(price) {

    const priceString = price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
