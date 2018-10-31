import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

class TaskForm extends React.Component {
    constructor() {
        super();

        this.state = {
            description: '',
            hours: 0,
            price: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addNewTask(event) {
        event.preventDefault();

        const task = { ...this.state };
        task.clientId = this.props.clientId;
        task.uid = this.props.uid;
        task.status = 'backlog';

        this.props.firestore.add(
            {
                collection: 'tasks'
            },
            task
        );

        this.setState({
            description: '',
            hours: 0,
            price: 0
        });
    }

    render() {
        return (
            <form className="new-task" onSubmit={this.addNewTask}>
                <input
                    type="text"
                    name="description"
                    onChange={this.handleChange}
                    value={this.state.description}
                />
                <input
                    type="number"
                    name="hours"
                    onChange={this.handleChange}
                    value={this.state.hours}
                />
                <button>Add</button>
            </form>
        );
    }
}

TaskForm.propTypes = {
    uid: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    firestore: PropTypes.shape({
        add: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired
    })
};

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

export default compose(
    connect(mapStateToProps),
    firestoreConnect()
)(TaskForm);
