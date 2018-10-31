/**
 * Given a task object, get the subtotal of the Task, based on the hourly rate / or the cost.
 *
 * @param {object} task  Data about the task.
 * @param {float}   rate  Client hourly rate.
 *
 * @return {float} Subtotal of the task.
 */
export function getTaskSubtotal(task, rate) {
    if (task.price) {
        return parseFloat(task.price);
    }

    const hours = parseFloat(task.hours);
    return parseFloat(hours * rate);
}
