import React from 'react';
import PropTypes from 'prop-types';

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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addNewClient() {
        if (!this.props.firebase) {
            return;
        }

        const client = { ...this.state };
        this.props.firebase.push(client);
    }

    render() {
        return (
            <div className="new-client">
                <div className="new-client__inner">
                    <p>Add a new client</p>

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
                        <button className="btn" onClick={this.addNewClient}>
                            Submit
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={this.props.close} className="cta-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

NewClientForm.propTypes = {
    close: PropTypes.func.isRequired,
    firebase: PropTypes.object
};

NewClientForm.defaultProps = {
    firebase: null
};

export default NewClientForm;
