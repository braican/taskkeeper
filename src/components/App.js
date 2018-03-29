import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

// import firebase
import base from '../firebase';

// import the components
import Header from './Header';
import ClientPane from './ClientPane';
import Welcome from './Welcome';

// import helpers
import { formatPrice } from '../helpers';

class App extends React.Component {
    constructor() {
        super();

        this.addTask = this.addTask.bind(this);
        this.submitInvoice = this.submitInvoice.bind(this);
        this.archiveInvoice = this.archiveInvoice.bind(this);
        this.renderClientList = this.renderClientList.bind(this);
        this.renderClientPane = this.renderClientPane.bind(this);

        this.state = {
            clients : {},
            loaded  : false,
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
            }
        });
    }


    /**
     * Adds a task to an invoice for the client
     */
    addTask(task, client) {
        const clients = { ...this.state.clients };

        if (!clients[client].openTasks) {
            clients[client].openTasks = [task];
        } else {
            clients[client].openTasks.push(task);
        }

        this.setState({ clients });
    }


    /**
     * Submits an invoice from a list of tasks
     */
    submitInvoice(client, tasks) {
        const clients = { ...this.state.clients };
        const timestamp = Date.now();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const formattedDate = `${year}/${month}/${day}`;

        clients[client].openTasks = [];

        if (!clients[client].invoices) {
            clients[client].invoices = {};
        }

        clients[client].invoices[timestamp] = {
            invoicedate : formattedDate,
            status      : 'active',
            tasks,
        };

        this.setState({ clients });
    }


    archiveInvoice(client, invoiceId) {
        const clients = { ...this.state.clients };
        clients[client].invoices[invoiceId].status = 'archive';
        this.setState({ clients });
    }


    /**
     * Renders the client listing
     * @param {string} key object key for the client
     */
    renderClientList(key) {
        const client = this.state.clients[key];

        return (
            <NavLink to={`/client/${key}`} className="clientLink" activeClassName="clientLink--active">
                <h3 className="clientthumb__name">{client.name}</h3>
                <p className="clientthumb__rate">{formatPrice(client.rate)}</p>
            </NavLink>
        );
    }


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


    /**
     * render function
     */
    render() {
        return (
            <BrowserRouter>
                <div className="taskkeeper app-main">
                    <aside className="leftpane">
                        <Header />
                        <ul className="clientList">
                            {
                                Object.keys(this.state.clients).map((key) => (
                                    <li className="clientThumb" key={key}>
                                        {this.renderClientList(key)}
                                    </li>
                                ))
                            }
                        </ul>
                    </aside>
                    <div className="clientPane">
                        <Switch>
                            <Route
                                path="/client/:clientId"
                                render={this.renderClientPane}
                            />
                            <Route component={Welcome} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
