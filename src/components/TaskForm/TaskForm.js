import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClientContext from '../../contexts/ClientContext';

import Toggler from '../Toggler';

import styles from './TaskForm.module.scss';

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
    <div className={styles.TaskForm}>
      <h4>Add a new task</h4>
      <form onSubmit={handleSubmit}>
        <div className={styles.formEl}>
          <label htmlFor="task-description">Description</label>
          <input
            id="task-description"
            type="text"
            value={taskDescription}
            onChange={e => updateDescription(e.target.value)}
          />
        </div>

        <div className={`${styles.toggler} ${styles.formEl}`}>
          <Toggler onLabel="Hours" offLabel="Cost" onChange={updateFlag} isOn={isFixedRate} />
        </div>

        <div className={`${styles.formEl} ${styles.formElNumber}`}>
          <label htmlFor="task-number">{isFixedRate ? 'Cost' : 'Hours'}</label>
          <input type="number" value={taskUnit} onChange={e => updatePrice(e.target.value)} />
        </div>

        <div className={`${styles.formEl} ${styles.actionPrimary}`}>
          <button className="action-primary">Add task</button>
        </div>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  taskRef: PropTypes.object,
};

export default connect(mapStateToProps)(TaskForm);
