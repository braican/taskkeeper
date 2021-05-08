import { createContext, useContext } from 'react';

/**
 * @returns array
 */
export const GlobalsContext = createContext({});

const useGlobals = () => useContext(GlobalsContext);

export default useGlobals;
