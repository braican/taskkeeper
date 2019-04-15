import moment from 'moment';

/**
 * Format a date.
 *
 * @param {string} date   The date to format.
 * @param {string} format Template to format the date.
 *
 * @return string
 */
export default function prettyDate(date, format = 'MMMM D, YYYY') {
  return moment(date, 'YYYY-MM-DD').format(format);
}
