/**
 * Calculates the total number of billable hours on of a list of tasks.
 *
 * @param {array} tasks List of tasks with associated hours.
 *
 * @return float
 */
export default function computeTotal(tasks) {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  return tasks
    .filter(task => task.hours !== '-')
    .reduce((acc, cur) => acc + parseFloat(cur.hours), 0);
}
