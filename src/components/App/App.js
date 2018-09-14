import React from 'react';
import firebase, { auth, provider } from '../../firebase';

import Profile from '../Profile/Profile';

import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            username: '',
            user: null
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.setState({
                loaded: true
            });
            if (user) {
                this.setState({ user });
            }
        });
    }

    login() {
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;
            this.setState({ user });
        });
    }

    logout() {
        auth.signOut().then(() => {
            this.setState({
                user: null
            });
        });
    }

    // render function
    render() {
        return (
            <div className={`app app--${this.state.user ? 'logged-in' : 'anonymous'}`}>
                <aside className="sidebar">
                    <div className="authdata">
                        {this.state.user ? (
                            <div>
                                <Profile user={this.state.user} />
                                <button onClick={this.logout}>Logout</button>
                            </div>
                        ) : null}
                    </div>

                    {this.state.user === null ? (
                        <div className="welcome">
                            {this.state.loaded ? (
                                <div>
                                    <h1>Taskkeeper</h1>
                                    <p className="space-em">
                                        Keep track of all your clients and tasks
                                    </p>
                                    <button onClick={this.login}>Log In</button>
                                </div>
                            ) : (
                                <div>
                                    <p>Loading</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </aside>

                <main className="appmain" />
            </div>
        );
    }
}

export default App;
