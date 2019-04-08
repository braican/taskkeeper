import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import CompleteIcon from '../../svg/complete';
import EditIcon from '../../svg/edit';
import DeleteIcon from '../../svg/delete';
import BackIcon from '../../svg/back';

import './TaskUtility.scss';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const TaskUtility = ({ uid, firestore, taskId, setIsEditing, style, active }) => {
  const [promptConfirmDelete, setPromptConfirmDelete] = useState(false);

  const completeTask = () => {
    firestore
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(taskId)
      .update({
        status: 'completed',
      });
  };

  const deleteTask = () => {
    firestore
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(taskId)
      .delete();
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
  uid: PropTypes.string,
  firestore: PropTypes.shape({
    collection: PropTypes.func,
  }),
  taskId: PropTypes.string,
  setIsEditing: PropTypes.func,
  active: PropTypes.bool,
  style: PropTypes.object,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(TaskUtility);
