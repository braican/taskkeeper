import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTaskSubtotal } from '../../util/tasks';
import { formatPrice } from '../../util/helpers';

class BacklogTasks extends React.Component {
    render() {
        const { tasks, rate } = this.props;

        if (!tasks) {
            return null;
        }

        return (
            <div>
                <h3>Backlog</h3>
                <ul className="client-list">
                    {tasks.map(task => (
                        <li key={task.id}>
                            {task.description} - {formatPrice(getTaskSubtotal(task, rate))}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

BacklogTasks.propTypes = {
    clientId: PropTypes.string,
    tasks: PropTypes.array,
    rate: PropTypes.number
};

const mapStateToProps = (state, props) => {
    if (!state.firestore.ordered.tasks) {
        return {};
    }

    const tasks = state.firestore.ordered.tasks.filter(task => task.clientId === props.clientId);

    return { tasks };
};

export default connect(mapStateToProps)(BacklogTasks);
