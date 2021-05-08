import { createContext, useContext } from 'react';

/**
 * @returns object
 */
export const AuthContext = createContext({
  /** @var function */
  signIn: () => {},

  /** @var function */
  signOut: () => {},

  /** @var boolean */
  loaded: false,

  /** @var boolean */
  authLoading: false,

  /** @var boolean|string */
  error: false,

  /** @var boolean */
  isSignedIn: false,

  /**
   * @var object
   * @property {string} uid
   * @property {string} name
   * @property {string} firstName
   * @property {string} email
   * @property {string} picture
   * @property {string} secret
   */
  userData: null,
});

const useAuth = () => useContext(AuthContext);

export default useAuth;
