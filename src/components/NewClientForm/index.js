import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import * as actionCreators from '../../actions/actionCreators';

import { slugify } from '../../util/helpers';

import './styles.css';

class NewClientForm extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            rate: 0,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.addNewClient = this.addNewClient.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    }

    addNewClient(event) {
        event.preventDefault();

        const { name, rate } = this.state;
        const slug = slugify(name);

        if (!name) {
            this.setState({ error: 'You need to input a name for this client.' });
            return;
        }

        this.props.firestore.add(
            {
                collection: 'clients'
            },
            {
                uid: this.props.uid,
                name,
                rate,
                slug
            }
        );

        this.setState({
            name: '',
            rate: 0
        });

        this.props.toggleNewClientDrawer();
    }

    render() {
        if (!this.props.uid) {
            return null;
        }

        return (
            <form className="new-client" onSubmit={this.addNewClient}>
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
                    {this.state.error ? (
                        <div className="new-client__error">{this.state.error}</div>
                    ) : null}
                    <div className="new-client__actions">
                        <button className="btn" type="submit">
                            Submit
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                            onClick={this.props.toggleNewClientDrawer}
                            type="button"
                            className="cta-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

NewClientForm.propTypes = {
    uid: PropTypes.string,
    firestore: PropTypes.shape({
        add: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired
    }),
    toggleNewClientDrawer: PropTypes.func
};

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });
const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firestoreConnect()
)(NewClientForm);
