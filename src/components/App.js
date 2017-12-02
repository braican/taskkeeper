import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

// import the components
import Header from './Header';
import ClientPane from './ClientPane';
import Welcome from './Welcome';

// import helpers
import { formatPrice } from '../helpers';

class App extends React.Component {
    constructor() {
        super();

        this.renderClientList = this.renderClientList.bind(this);

        this.state = {
            clients : {
                anywayreps : {
                    name : 'Anyway Reps',
                    rate : 56.00,

                    invoices : {
                        20171120323 : {
                            invoicedate : '2017/11/20',
                            status      : 'active',
                            tasks       : [
                                {
                                    description : 'Fixing navigation bugs',
                                    price       : null,
                                    hours       : 4,
                                }, {
                                    description : 'Pushing new navigation live',
                                    price       : null,
                                    hours       : 2,
                                }, {
                                    description : 'Updating all the plugins',
                                    price       : 100.00,
                                    hours       : null,
                                },
                            ],
                        },
                        20171120352 : {
                            invoicedate : '2017/11/20',
                            status      : 'active',
                            tasks       : [
                                {
                                    description : 'Lorem ipsum dolor site',
                                    price       : null,
                                    hours       : 4,
                                }, {
                                    description : 'Updating visibility on the PDF builde',
                                    price       : null,
                                    hours       : 10,
                                },
                            ],
                        },
                    },
                },
                christabianchi : {
                    name : 'Christa Bianchi',
                    rate : 56.00,
                },
                gibhedstrom : {
                    name : 'Gib Hedstrom',
                    rate : 58.00,
                },
            },
        };
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
                                Object.keys(this.state.clients).map((key) => {
                                    return (
                                        <li className="clientThumb" key={key}>
                                            {this.renderClientList(key)}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </aside>
                    <div className="clientPane">
                        <Switch>
                            <Route
                                path="/client/:clientId"
                                render={(props) => (
                                    <ClientPane
                                        client={this.state.clients[props.match.params.clientId]}
                                    />
                                )}
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
