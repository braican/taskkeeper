import sanitizeHtml from 'sanitize-html';

export * from './dates';

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
 * Function to be used in callbacks to filter things that belong to a specific client.
 *
 * @param {array} things A list of things that have a client ID attached to them.
 * @param {string} clientId The client to filter for.
 *
 * @return array
 */
export const clientFilter = (things, clientId) => {
  if (!things) {
    return [];
  }
  return things.filter(thing => thing.client === clientId);
};

/**
 * Gets the subtotal of an individual task.
 *
 * @param {object} task Task data.
 * @param {float} rate Client hourly rate.
 *
 * @return float
 */
export const computeTaskSubtotal = (task, rate) => {
  if ((task.hours === undefined || task.hours === 0 || task.hours === '') && task.price) {
    return parseFloat(task.price);
  }

  if (task.hours !== undefined && task.hours !== '') {
    return parseFloat(task.hours) * parseFloat(rate);
  }

  return 0;
};

/**
 * Calculates the total number of billable hours on of a list of tasks.
 *
 * @param {array} tasks List of tasks with associated hours.
 *
 * @return float
 */
export const computeHours = tasks => {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  return tasks
    .filter(task => task.hours && task.hours !== '-')
    .reduce((acc, cur) => acc + parseFloat(cur.hours), 0);
};

/**
 * Calculates the total price of a list of tasks.
 *
 * @param {array} tasks List of tasks with associated individual cost.
 * @param {float} rate Client hourly rate.
 *
 * @return float
 */
export const computeTotal = (tasks, rate) => {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  rate = parseFloat(rate);

  const total = tasks.reduce((acc, task) => acc + computeTaskSubtotal(task, rate), 0);
  return total;
};

/**
 * Strip the client abbreviation from the invoice ID.
 *
 * @param {string} id Full invoice ID, including the symbol.
 * @param {string} symbol The client abbreviation.
 *
 * @return int
 */
export const parseInvoiceId = (id, symbol) => parseInt(id.replace(`${symbol}-`, '', id));

/**
 * Increment the invoice ID.
 *
 * @param {int} invoiceNumber The count of invoices for a client.
 * @param {string} symbol The client abbreviation
 *
 * @return string The full invoice ID.
 */
export const incrementInvoiceId = (invoiceNumber, symbol) => {
  const newId = `${invoiceNumber + 1}`.padStart(4, '0');
  return `${symbol}-${newId}`;
};

/**
 * Sanitize input strings of all html.
 *
 * @param {string} value Some input string.
 *
 * @return string
 */
export const sanitizeInput = value => {
  return sanitizeHtml(value, {
    allowedTags: ['br'],
    allowedAttributes: {},
    transformTags: {
      div: 'br',
    },
  });
};

/**
 * Sets up a map from a list of passed things from Firebase.
 *
 * @param {array} list List of things with IDs.
 *
 * @return object Map of things with IDs as keys.
 */
export const setupIdMap = list => {
  if (!list) {
    return {};
  }

  return list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};
