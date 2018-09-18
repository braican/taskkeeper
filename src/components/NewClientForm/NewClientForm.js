import React from 'react';
import PropTypes from 'prop-types';

import { slugify } from '../../util';

import './NewClientForm.css';

class NewClientForm extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            rate: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.addNewClient = this.addNewClient.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addNewClient(event) {
        event.preventDefault();
        if (!this.props.clientRef) {
            return;
        }

        const client = { ...this.state };
        client.slug = slugify(client.name);
        this.props.clientRef.push(client);

        this.clientForm.reset();
        this.props.close();
    }

    render() {
        return (
            <form
                className="new-client"
                ref={input => {
                    this.clientForm = input;
                }}
                onSubmit={this.addNewClient}
            >
                <div className="new-client__inner">
                    <h2>Add a new client</h2>

                    <div className="new-client__input space-top">
                        <input
                            type="text"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                        />
                        <label htmlFor="client_name">Client name</label>
                    </div>

                    <div className="new-client__input">
                        <input
                            type="number"
                            name="rate"
                            min="0"
                            onChange={this.handleChange}
                            value={this.state.rate}
                        />
                        <label htmlFor="client_rate">Client rate</label>
                    </div>

                    <div className="new-client__actions">
                        <button className="btn" type="submit">
                            Submit
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={this.props.close} className="cta-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

NewClientForm.propTypes = {
    close: PropTypes.func.isRequired,
    clientRef: PropTypes.object.isRequired
};

export default NewClientForm;
