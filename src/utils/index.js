/**
 * React helper to aid in adding classes for css modules.
 *
 * @param  {...any} classes The classes to add to an element.
 *
 * @return object
 */
export const className = (...classes) => ({
  className: classes.filter(className => typeof className === 'string').join(' '),
});
