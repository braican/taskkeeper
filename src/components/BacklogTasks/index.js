import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class BacklogTasks extends React.Component {
    render() {
        const { tasks } = this.props;

        if (!tasks) {
            return null;
        }

        return (
            <div className="client-admin">
                <ul className="client-list">
                    {tasks.map(task => (
                        <li key={task.id}>{task.description}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

BacklogTasks.propTypes = {
    tasks: PropTypes.array
};

const mapStateToProps = (state, props) => {
    if (!state.firestore.ordered.tasks) {
        return {};
    }

    const tasks = state.firestore.ordered.tasks.filter(task => task.clientId === props.clientId);

    return { tasks };
};

export default connect(mapStateToProps)(BacklogTasks);
