import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// import { createStore, compose } from 'redux';

import './sass/style.css';

// Import components
import App from './components/App/App';
import Profile from './components/Profile/Profile';

// Redux and react things

// import { BrowserRouter, Switch, Route, Router, Link } from 'react-router-dom';
import store from './store';

// <Provider store={store}>
//     <BrowserRouter>
//         <App>
//             <Switch>
//                 <Route
//                     path="/client/:clientSlug"
//                     render={() => <h2>This is a client page</h2>}
//                 />
//                 <Route path="/" render={() => <p>No client page</p>} />
//             </Switch>
//         </App>
//     </BrowserRouter>
// </Provider>

const router = (
    <Provider store={store}>
        <App>
            <Profile user="null" />
        </App>
        {/* <App> */}
        {/* <BrowserRouter>
                <Switch>
                    <Route
                        path="/client/:clientSlug"
                        component={() => (
                            <h1>
                                Client page <Link to="/">Home</Link>
                            </h1>
                        )}
                    />
                    <Route
                        component={() => (
                            <p>
                                Homepage <Link to="/client/adam">Adam</Link>
                            </p>
                        )}
                    />
                </Switch>
            </BrowserRouter> */}
        {/* </App> */}
    </Provider>
);

render(router, document.getElementById('root'));
