/**
 * React helper to aid in adding classes for css modules.
 *
 * @param {...any} classes The classes to add to an element.
 *
 * @return object
 */
export const className = (...classes) => ({
  className: classes.filter(className => typeof className === 'string').join(' '),
});

/**
 * Removes the element from the array. WARNING: this works only for single-depth arrays with
 * strings or numbers. This will not work with objects.
 *
 * @param {array} arr Array to remove an item from.
 * @param {mixed} item The item to remove.
 */
export const arrayRemove = (arr, item) => {
  const index = arr.indexOf(item);

  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
};

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
