import moment from 'moment';

/**
 * Gets a date. Defaults to today, but if a number is passed to this, it returns the date the given
 *  amount of days to the future.
 *
 * @param {int} future Number of days in the future to get the date of.
 *
 * @return string
 */
export default function getDate(future) {
  const date = future ? moment().add(future, 'days') : moment();
  return date.format('YYYY-MM-DD');
}
