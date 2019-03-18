import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';

import Toggler from '../Toggler';

import './TaskForm.scss';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const TaskForm = ({ uid, firestore, clientId }) => {
  const { rate } = useContext(ClientContext);
  const [taskDescription, updateDescription] = useState('');
  const [taskUnit, updatePrice] = useState('');
  const [isFixedRate, updateFlag] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    const price = isFixedRate ? taskUnit : taskUnit * rate;
    const taskData = {
      client: clientId,
      status: 'active',
      description: taskDescription,
      price,
      hours: isFixedRate ? 0 : taskUnit,
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
