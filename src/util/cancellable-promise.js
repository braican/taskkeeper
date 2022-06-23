/**
 * A simple class we create just for tracking our running functions
 */
class Concurrency {
  get(key) {
    return this[key] || {};
  }

  set(key, value) {
    this[key] = value;
  }
}

const concurrencyInstance = new Concurrency();

/**
 * Utility for cancelling a promise before continuing further work. This is helpful
 * for `useEffect` cleanup, in which a promise should be cancelled before updating
 * state.
 *
 * @example
 * ```js
 * const fetchItem = function* () {
 *   const item = yield fetch(itemName); // wait for promise to fulfill
 *   setItem(item); // if not cancelled, set item
 * };
 *
 * useEffect(() => {
 *   const cancelFetch = cancellablePromise(fetchItem);
 *   return () => {
 *     cancelFetch(); // cancel the promise from fulfilling
 *     setItem(null); // reset item regardless
 *   }
 * }, [itemName]);
 * ```
 *
 * @param {GeneratorFunction} generatorFunc a generator function that yields
 * a promise, and then performs other work after
 *
 * @returns {() => void} a callback to cancel the promise
 */
export const cancellablePromise = (generatorFunc, name = 'generator-function') => {
  // See if there is a stored function with the same name as the one we are trying
  const instanceFunction = concurrencyInstance.get(name);

  // If there is, stop it from running
  if (instanceFunction.return) {
    instanceFunction.return();
  }

  const generatorInstance = generatorFunc();
  concurrencyInstance.set(name, generatorInstance);

  /* eslint-disable-next-line */
  generatorInstance.next().value.then(function () {
    generatorInstance.next(...arguments);
  });

  return () => {
    generatorInstance.return();
  };
};
