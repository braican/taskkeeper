import { createContext } from 'react';

/**
 * @returns object
 *
 * signIn        => function
 * signOut       => function
 * loaded        => boolean
 * authLoading   => boolean
 * error         => false|string
 * isSignedIn    => boolean
 * userData      => object
 *   uid       => string
 *   name      => string
 *   firstName => string
 *   email     => string
 *   picture   => string
 *   secret    => string
 */
export const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  loaded: false,
  authLoading: false,
  error: false,
  isSignedIn: false,
  userData: null,
});
