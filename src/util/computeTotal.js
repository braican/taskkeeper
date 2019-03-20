/**
 * Calculates the total price of a list of tasks.
 *
 * @param {array} tasks List of tasks with associated individual cost.
 *
 * @return float, null if there are no tasks
 */
export default function computeTotal(tasks) {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  return tasks.reduce((acc, cur) => acc + parseFloat(cur.price), 0);
}
