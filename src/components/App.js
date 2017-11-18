import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

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
            <li className="clientthumb" key={key}>
                <Link to={`/client/${key}`}>
                    <h3 className="clientthumb__name">{client.name}</h3>
                    <p className="clientthumb__rate">{formatPrice(client.rate)}</p>
                </Link>
            </li>
        );
    }


    /**
     * render function
     */
    render() {
        return (
            <div className="taskkeeper">
                <Header />

                <BrowserRouter>
                    <div>
                        <div className="clientList">
                            <ul>
                                {Object.keys(this.state.clients).map(this.renderClientList)}
                            </ul>
                        </div>
                        <div className="clientPane">
                            <Switch>
                                <Route path="/client/:clientId" render={(props) => <ClientPane clients={this.state.clients} params={props.match.params} />} />
                                <Route component={Welcome} />
                            </Switch>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
