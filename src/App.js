import React from 'react';
import Login from './components/Login';
import { useAuth } from './contexts/auth';

const App = () => {
  const { loaded, isSignedIn, userData } = useAuth();

  return (
    <div className="App">
      <header>
        <h1>Taskkeeper</h1>
      </header>

      {loaded ? <>{isSignedIn ? <p>What up {userData.name}</p> : <Login />}</> : <p>Loading...</p>}
    </div>
  );
};

export default App;
