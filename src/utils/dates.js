import moment from 'moment';

/**
 * Get a formatted date for an input.
 *
 * @param {string} date Optional date to retrieve.
 *
 * @return string Formatted date for an input.
 */
export const getDate = (date = null) => {
  date = date ? new Date(date) : new Date();
  return date.toISOString().substr(0, 10);
};

/**
 * Get a formatted date some amount of days in the future.
 *
 * @param {number} future Number of days in the future to retrieve.
 * @param {string} date Optional date to retrieve.
 *
 * @return string Formatted date for an input.
 */
export const getFutureDate = (future, date = null) => {
  date = date ? new Date(date) : new Date();
  date.setDate(date.getDate() + future);
  return date.toISOString().substr(0, 10);
};

/**
 * Gets the amount of time until the given due date.
 *
 * @param {string} dueDate The due date.
 *
 * @return string
 */
export const dueDateIn = dueDate => moment(dueDate, 'YYYY-MM-DD').fromNow();

/**
 * Format a date.
 *
 * @param {string} date   The date to format.
 * @param {string} format Template to format the date.
 *
 * @return string
 */
export const prettyDate = (date, format = 'MMMM D, YYYY') =>
  moment(date, 'YYYY-MM-DD').format(format);
