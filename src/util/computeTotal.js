/**
 * Calculates the total price of a list of tasks.
 *
 * @param {array} tasks List of tasks with associated individual cost.
 *
 * @return float
 */
export default function computeTotal(tasks) {
  return tasks.reduce((acc, cur) => acc + parseFloat(cur.price), 0);
}
