import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClientContext from '../../contexts/ClientContext';

import Toggler from '../Toggler';

import './TaskForm.scss';

const mapStateToProps = state => ({ taskRef: state.refs.tasks });

const TaskForm = ({ taskRef }) => {
  const { rate, clientId } = useContext(ClientContext);
  const [taskDescription, updateDescription] = useState('');
  const [taskUnit, updatePrice] = useState('');
  const [isFixedRate, updateFlag] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    const price = isFixedRate ? taskUnit : taskUnit * rate;
    const taskData = {
      client: clientId,
      status: 'estimated',
      description: taskDescription,
      price,
      hours: isFixedRate ? 0 : taskUnit,
      timestamp: +new Date(),
    };

    taskRef.add(taskData);
    updateDescription('');
    updatePrice('');
  };

  return (
    <div className="TaskForm">
      <h4>Add a new task</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskDescription}
          onChange={e => updateDescription(e.target.value)}
        />

        <Toggler onLabel="Hours" offLabel="Cost" onChange={updateFlag} isOn={isFixedRate} />

        <input type="number" value={taskUnit} onChange={e => updatePrice(e.target.value)} />

        <button className="action-primary">Add task</button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  taskRef: PropTypes.object,
};

export default connect(mapStateToProps)(TaskForm);
