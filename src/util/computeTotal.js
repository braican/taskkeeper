import formatPrice from './formatPrice';

/**
 * Calculates the total price of a list of tasks.
 *
 * @param {array}   tasks  List of tasks with associated individual cost.
 * @param {boolean} format Option to format the returned value.
 *
 * @return float, null if there are no tasks
 */
export default function computeTotal(tasks, format = false) {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  const total = tasks.reduce((acc, cur) => acc + parseFloat(cur.price), 0);
  return format ? formatPrice(total) : total;
}
