
/**
 * Format the price
 * @param {number} price A price, in dollars and cents
 */
export function formatPrice(price) {
    return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
