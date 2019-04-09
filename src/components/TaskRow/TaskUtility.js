import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CompleteIcon from '../../svg/complete';
import EditIcon from '../../svg/edit';
import DeleteIcon from '../../svg/delete';
import BackIcon from '../../svg/back';

import './TaskUtility.scss';

const mapStateToProps = state => ({ taskRef: state.refs.tasks });

const TaskUtility = ({ taskRef, taskId, setIsEditing, style, active }) => {
  const [promptConfirmDelete, setPromptConfirmDelete] = useState(false);

  const completeTask = () => {
    taskRef.doc(taskId).update({
      status: 'completed',
    });
  };

  const deleteTask = () => {
    taskRef.doc(taskId).delete();
  };

  useEffect(() => {
    setPromptConfirmDelete(false);
  }, [active]);

  return (
    <div
      className={`TaskUtility ${active ? 'active' : ''} ${promptConfirmDelete ? 'wide' : ''}`}
      style={style}>
      <ul>
        <li>
          <button className="complete" onClick={completeTask}>
            <CompleteIcon />
          </button>
        </li>
        <li>
          <button className="edit" onClick={setIsEditing}>
            <EditIcon />
          </button>
        </li>
        <li>
          <button className="delete" onClick={() => setPromptConfirmDelete(true)}>
            <DeleteIcon />
          </button>

          <div className={`confirm-delete-modal${promptConfirmDelete ? ' active' : ''}`}>
            <button className="dont-delete" onClick={() => setPromptConfirmDelete(false)}>
              <BackIcon />
            </button>

            <span>Delete task?</span>

            <button className="confirm-delete" onClick={deleteTask}>
              <DeleteIcon />
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

TaskUtility.propTypes = {
  taskRef: PropTypes.object,
  taskId: PropTypes.string,
  setIsEditing: PropTypes.func,
  active: PropTypes.bool,
  style: PropTypes.object,
};

export default connect(mapStateToProps)(TaskUtility);
