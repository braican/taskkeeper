import React from 'react';
import firebase, { auth, provider } from '../../firebase';
import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            user: null
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
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
        const { user } = this.state;
        return (
            <div
                className={`app app--${
                    this.state.user ? 'logged-in' : 'anonymous'
                }`}
            >
                <header className="header">
                    <h1>Taskkeeper</h1>
                    <div>
                        {this.state.user ? (
                            <button onClick={this.logout}>Logout</button>
                        ) : (
                            <button onClick={this.login}>Log In</button>
                        )}
                    </div>
                </header>

                <div className="appframe">
                    <aside className="sidebar">
                        {this.state.user ? (
                            <div>
                                <img
                                    src={user.photoURL}
                                    alt={`Thumbnail of ${user.displayName ||
                                        user.email}`}
                                />
                                <p>{user.displayName || user.email}</p>
                            </div>
                        ) : null}
                    </aside>

                    <main className="appmain" />
                </div>
            </div>
        );
    }
}

export default App;
