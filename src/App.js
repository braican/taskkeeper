import React from 'react';
import Login from './components/Login';
import { useAuth } from './contexts/auth';

import { post } from './util';

const App = () => {
  const { loaded, isSignedIn, error, userData } = useAuth();

  return (
    <div className="App">
      <header>
        <h1>Taskkeeper</h1>
      </header>

      {loaded ? (
        <>
          {error ? (
            <p>{error}</p>
          ) : isSignedIn ? (
            <div>
              <p>
                What up {userData.name} with email {userData.email}
              </p>{' '}
              <button
                onClick={() => {
                  post('addClient', { secret: userData.secret })
                    .then(data => {
                      console.log(data);
                    })
                    .catch(console.error);
                }}>
                test
              </button>
            </div>
          ) : (
            <Login />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
