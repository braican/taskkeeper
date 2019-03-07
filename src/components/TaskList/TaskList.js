import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

const mapStateToProps = (state, props) => {
  return {
    uid: state.firebase.auth.uid,
    tasks: state.firestore.ordered.tasks,
  };
};

/**
 * Query the "client" subcollection for the current user.
 *
 * @param {string} uid UID of the current user. This comes from the props passed to this component,
 *                     as mapped in the `mapStateToProps` function.
 *
 * @return array
 */
const taskQuery = ({ uid, clientId }) => {
  if (!uid) {
    return [];
  }

  return [
    {
      collection: 'users',
      doc: uid,
      subcollections: [
        {
          collection: 'tasks',
          where: [['client', '==', clientId]],
        },
      ],
      storeAs: `${clientId}_tasks`,
    },
  ];
};

const TaskList = props => {
  console.log(props);

  // if (!tasks) {
  //   return null;
  // }

  // console.log(tasks);

  return (
    <ul>
      {/* {tasks.map(({ id, description, price }) => (
        <li key={id}>{description}</li>
      ))} */}
    </ul>
  );
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(taskQuery),
)(TaskList);
