import moment from 'moment';

/**
 * Gets the amount of time until the given due date.
 *
 * @param {string} dueDate The due date.
 *
 * @return string
 */
export default function dueDateIn(dueDate) {
  return moment(dueDate, 'YYYY-MM-DD').fromNow();
}
