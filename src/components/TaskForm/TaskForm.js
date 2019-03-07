import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';

import './TaskForm.scss';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const TaskForm = ({ uid, firestore, clientId }) => {
  const { rate } = useContext(ClientContext);
  const [taskDescription, updateDescription] = useState('');
  const [taskPrice, updatePrice] = useState('');
  const [isFixedRate, updateFlag] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    const price = isFixedRate ? taskPrice : taskPrice * rate;
    const taskData = {
      description: taskDescription,
      price,
      client: clientId,
    };

    firestore
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .add(taskData);

    updateDescription('');
    updatePrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="TaskForm">
      <input
        type="text"
        value={taskDescription}
        onChange={e => updateDescription(e.target.value)}
      />

      <div className="unit-toggle">
        <button
          type="button"
          className={`toggle-label${isFixedRate ? ' toggle-label--disabled' : ''}`}
          onClick={() => updateFlag(false)}>
          Hours
        </button>

        <input
          type="checkbox"
          className="unit-toggle-control"
          id="task-unit-toggle"
          checked={isFixedRate}
          onChange={e => updateFlag(e.target.checked)}
        />
        <label className="unit-toggle-track" htmlFor="task-unit-toggle">
          &nbsp;
        </label>

        <button
          type="button"
          className={`toggle-label${!isFixedRate ? ' toggle-label--disabled' : ''}`}
          onClick={() => updateFlag(true)}>
          Cost
        </button>
      </div>

      <input type="number" value={taskPrice} onChange={e => updatePrice(e.target.value)} />

      <button>Add task</button>
    </form>
  );
};

TaskForm.propTypes = {
  uid: PropTypes.string,
  firestore: PropTypes.shape({
    collection: PropTypes.func,
  }),
  clientId: PropTypes.string.isRequired,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(TaskForm);
