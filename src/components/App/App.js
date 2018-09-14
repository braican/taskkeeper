import React from 'react';
import firebase, { auth, provider } from '../../firebase';

import Profile from '../Profile/Profile';
import ClientList from '../ClientList/ClientList';
import NewClientForm from '../NewClientForm/NewClientForm';

import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            username: '',
            user: null,
            newClientForm: false
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.openNewClientForm = this.openNewClientForm.bind(this);
        this.closeNewClientForm = this.closeNewClientForm.bind(this);
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

    /**
     * Opens the new client form
     */
    openNewClientForm() {
        this.setState({ newClientForm: true });
    }

    /**
     * Close the new client form
     */
    closeNewClientForm() {
        this.setState({ newClientForm: false });
    }

    // render function
    render() {
        let appClass = `app--${this.state.user ? 'logged-in' : 'anonymous'}`;

        if (this.state.newClientForm) {
            appClass += ' app--new-client';
        }

        return (
            <div className={`app ${appClass}`}>
                <aside className="sidebar">
                    <div className="authdata">
                        {this.state.user ? (
                            <div>
                                <Profile user={this.state.user} />
                                <button className="btn" onClick={this.logout}>
                                    Logout
                                </button>
                                <ClientList />
                                <button className="btn" onClick={this.openNewClientForm}>
                                    New Client
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {this.state.user === null ? (
                        <div className="welcome">
                            {this.state.loaded ? (
                                <div>
                                    <h1>Taskkeeper</h1>
                                    <p>Keep track of all your clients and tasks</p>
                                    <button onClick={this.login} className="space-top">
                                        Log In
                                    </button>
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

                <NewClientForm
                    close={this.closeNewClientForm}
                    firebase={
                        this.state.user
                            ? firebase.database().ref(`${this.state.user.uid}/clients`)
                            : null
                    }
                />
            </div>
        );
    }
}

export default App;
