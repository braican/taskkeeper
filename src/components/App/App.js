import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import firebase, { auth, provider } from '../../firebase';

import LogoutButton from '../LogoutButton/LogoutButton';
import Profile from '../Profile/Profile';
import ClientList from '../ClientList/ClientList';
import NewClientForm from '../NewClientForm/NewClientForm';
import ClientPane from '../ClientPane/ClientPane';

import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            username: '',
            user: null,
            newClientForm: false,
            db: firebase.firestore()
        };

        this.state.db.settings({
            timestampsInSnapshots: true
        });

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.openNewClientForm = this.openNewClientForm.bind(this);
        this.closeNewClientForm = this.closeNewClientForm.bind(this);
        this.renderClientPane = this.renderClientPane.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.setState({
                loaded: true
            });

            if (!user) {
                return;
            }

            const userRef = this.state.db.collection('users');

            this.setState({ user });

            userRef
                .doc(user.uid)
                .get()
                .then(doc => {
                    if (!doc.exists) {
                        userRef.doc(user.uid).set({
                            email: user.email
                        });
                    }
                });
        });
    }

    /**
     * Log the user in.
     *
     * @return void
     */
    login() {
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;
            this.setState({ user });
        });
    }

    /**
     * Log the user out.
     *
     * @return void
     */
    logout() {
        auth.signOut().then(() => {
            this.setState({ user: null });
        });
    }

    /**
     * Opens the new client form
     *
     * @return void
     */
    openNewClientForm() {
        this.setState({ newClientForm: true });
    }

    /**
     * Close the new client form
     *
     * @return void
     */
    closeNewClientForm() {
        this.setState({ newClientForm: false });
    }

    /**
     * Render the ClientPane.
     *
     * @param {object} props The properties based in via the url.
     *
     * @return ClientPane
     */
    renderClientPane(props) {
        if (this.state.user === null) {
            return null;
        }

        const slug = props.match.params.clientSlug;
        const getOptions = {
            source: 'default'
        };

        const clientRef = this.state.db
            .collection('clients')
            .doc(slug)
            .get(getOptions);

        const invoiceRef = this.state.db.collection('invoices');
        const taskRef = this.state.db.collection('tasks');
        return (
            <ClientPane
                slug={slug}
                clientRef={clientRef}
                invoiceRef={invoiceRef}
                taskRef={taskRef}
            />
        );
    }

    /**
     * Return the classes for the app container, indicating state.
     *
     * @return string
     */
    getAppState() {
        let classes = `app--${this.state.user ? 'logged-in' : 'anonymous'}`;

        if (this.state.newClientForm) {
            classes += ' app--new-client';
        }

        return classes;
    }

    // render function
    render() {
        const appClass = this.getAppState();
        const clientsRef = this.state.user ? this.state.db.collection('clients') : null;
        const userClientsQuery = clientsRef
            ? clientsRef.where('user', '==', this.state.user.uid)
            : null;

        return (
            <BrowserRouter>
                <div className={`app ${appClass}`}>
                    <aside className="sidebar">
                        <div className="authdata">
                            {this.state.user ? (
                                <div>
                                    <Profile user={this.state.user} />
                                    <Route
                                        render={props => (
                                            <LogoutButton {...props} click={this.logout} />
                                        )}
                                    />
                                    <ClientList clientRef={userClientsQuery} />
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
                                        <button onClick={this.login} className="space-top btn">
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

                    <main className="appmain">
                        <Switch>
                            <Route path="/client/:clientSlug" render={this.renderClientPane} />
                            <Route render={() => <p>Nope</p>} />
                        </Switch>
                    </main>

                    {this.state.user ? (
                        <NewClientForm
                            close={this.closeNewClientForm}
                            clientRef={clientsRef}
                            user={this.state.user.uid}
                        />
                    ) : null}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
