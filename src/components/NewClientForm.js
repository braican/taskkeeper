import React from 'react';
import PropTypes from 'prop-types';


class NewClientForm extends React.Component {
    addNewClient(event) {
        event.preventDefault();

        let { clientName, clientRate } = this;
        clientName = clientName.value;
        clientRate = clientRate.value || '0';
        const clientKey = encodeURIComponent(clientName.toLowerCase().replace(/\s|\.|#|\$|\[|\]/g, ''));

        if (clientName === '') {
            console.error('All clients have a name. Please add one.');
            return;
        }

        const clientObj = {
            name : clientName,
            rate : clientRate,
        };

        this.props.addNewClient(clientKey, clientObj);
        this.clientForm.reset();
        this.props.toggleNewClientForm();
    }


    render() {
        return (
            <div className={`clientform__overlay${this.props.isVisible ? ' clientform__overlay--visible' : ''}`}>
                <form
                    className="clientform"
                    ref={(input) => { this.clientForm = input; }}
                    onSubmit={(e) => this.addNewClient(e)}
                >
                    <header className="clientform__header">
                        <h3>Add a new client</h3>
                    </header>

                    <div className="clientform__el">
                        <input
                            ref={(input) => { this.clientName = input; }}
                            name="client_name"
                            className="clientform__input"
                            type="text"
                            placeholder="Client Name"
                        />
                    </div>

                    <div className="clientform__el">
                        <span className="clientform__beforeinput">$</span>
                        <input
                            ref={(input) => { this.clientRate = input; }}
                            name="client_rate"
                            className="clientform__input clientform__input--number"
                            type="number"
                            placeholder="Hourly Rate"
                        />
                    </div>

                    <div className="clientform__actions">
                        <button className="tk-btn tk-btn--submit">Add client</button>
                        <button type="button" onClick={() => this.props.toggleNewClientForm()}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

NewClientForm.propTypes = {
    isVisible           : PropTypes.bool,
    toggleNewClientForm : PropTypes.func.isRequired,
    addNewClient        : PropTypes.func.isRequired,
};

NewClientForm.defaultProps = {
    isVisible : false,
};


export default NewClientForm;
