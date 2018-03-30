import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// import firebase
import base from '../firebase';

// import the components
import Header from './Header';
import ClientSidebar from './ClientSidebar';
import ClientPane from './ClientPane';
import NewClientForm from './NewClientForm';
import Default from './Default';


class App extends React.Component {
    constructor() {
        super();

        // actions
        this.addTask = this.addTask.bind(this);
        this.submitInvoice = this.submitInvoice.bind(this);
        this.archiveInvoice = this.archiveInvoice.bind(this);
        this.addNewClient = this.addNewClient.bind(this);
        this.toggleNewClientForm = this.toggleNewClientForm.bind(this);

        // renderers
        this.renderClientPane = this.renderClientPane.bind(this);

        this.state = {
            clients              : {},
            loaded               : false,
            newClientFormVisible : false,
        };
    }


    componentDidMount() {
        base.syncState('clients', {
            context : this,
            state   : 'clients',
            then() {
                this.setState({
                    loaded : true,
                });
            },
        });
    }


    /**
     * Adds a task to an invoice for the client
     */
    addTask(task, client) {
        const clients = { ...this.state.clients };
        const key =
            (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

        if (!clients[client].openTasks) {
            clients[client].openTasks = {};
        }
        clients[client].openTasks[key] = task;

        this.setState({ clients });
    }


    /**
     * Submits an invoice from a list of tasks
     */
    submitInvoice(client, tasks) {
        const clients = { ...this.state.clients };
        const openTasks = { ...clients[client].openTasks };
        const timestamp = Date.now();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const formattedDate = `${year}/${month}/${day}`;

        if (!clients[client].invoices) {
            clients[client].invoices = {};
        }

        if (Object.keys(tasks).length > 0) {
            clients[client].invoices[timestamp] = {
                invoicedate : formattedDate,
                status      : 'active',
                tasks,
            };
        }

        Object.keys(tasks).map((taskId) => {
            openTasks[taskId] = null;
            return true;
        });
        clients[client].openTasks = openTasks;

        this.setState({ clients });
    }


    /**
     * Archive the invoice
     * @param {string} client The client
     * @param {string} invoiceId ID of the invoice
     */
    archiveInvoice(client, invoiceId) {
        const clients = { ...this.state.clients };
        clients[client].invoices[invoiceId].status = 'archive';
        this.setState({ clients });
    }


    /**
     * Adds a new client to the state object
     * @param {string} clientKey The key for the client
     * @param {object} clientData Data about the client
     */
    addNewClient(clientKey, clientData) {
        const clients = { ...this.state.clients };
        clients[clientKey] = clientData;

        this.setState({ clients });
    }


    /**
     * Opens or closes the new client form
     */
    toggleNewClientForm() {
        const newClientFormStatus = this.state.newClientFormVisible;
        this.setState({ newClientFormVisible : !newClientFormStatus });
    }


    //
    // RENDER
    //


    /**
     * Render the Client pane
     * @param {Object} props // the props
     */
    renderClientPane(props) {
        const clientKey = props.match.params.clientId;
        const clientObj = this.state.clients[clientKey];

        return (
            <ClientPane
                clientKey={clientKey}
                client={clientObj}
                addTask={this.addTask}
                submitInvoice={this.submitInvoice}
                archiveInvoice={this.archiveInvoice}
                loaded={this.state.loaded}
            />
        );
    }


    // render function
    render() {
        return (
            <BrowserRouter>
                <div className="taskkeeper app-main">
                    <aside className="leftpane">
                        <Header />
                        <ClientSidebar
                            clients={this.state.clients}
                            toggleNewClientForm={this.toggleNewClientForm}
                        />
                    </aside>
                    <div className="clientPane">
                        <Switch>

                            <Route
                                path="/client/:clientId"
                                render={this.renderClientPane}
                            />

                            <Route
                                render={() => (
                                    <Default
                                        loaded={this.state.loaded}
                                        clients={this.state.clients}
                                    />
                                )}
                            />
                        </Switch>
                    </div>

                    <NewClientForm
                        isVisible={this.state.newClientFormVisible}
                        toggleNewClientForm={this.toggleNewClientForm}
                        addNewClient={this.addNewClient}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
