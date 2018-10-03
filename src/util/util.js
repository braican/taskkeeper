import React from 'react';

/* eslint-disable */

/**
 * Transform a string into a slug.
 *
 * @param {string} text The text to transform into a slug.
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
/* eslint-enable */

/**
 * Format the price.
 *
 * @param {number} price A price, in dollars and cents
 */
export function formatPrice(price) {
    const priceNumber = parseFloat(price);
    const priceString = priceNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const dollars = priceString.slice(0, priceString.length - 2).replace('.', '');
    const cents = priceString.slice(-2);

    return (
        <span>
            ${dollars}
            <span className="cents">.{cents}</span>
        </span>
    );
}
