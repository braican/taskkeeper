import React from 'react';

/**
 * Format the price.
 *
 * @param {number} price A price, in dollars and cents
 *
 * @return {jsx} The formatted dollars and cents.
 */
export default function formatPrice(price) {
  const priceNumber = parseFloat(price);
  const priceString = priceNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const dollars = priceString.slice(0, priceString.length - 2).replace('.', '');
  const cents = priceString.slice(-2);

  return (
    <span>
      ${dollars}.<sup className="cents">{cents}</sup>
    </span>
  );
}
