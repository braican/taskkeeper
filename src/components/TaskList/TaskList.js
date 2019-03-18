import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import formatPrice from '../../util/formatPrice';
import computeTotal from '../../util/computeTotal';

import TaskRow from './TaskRow';

import './TaskList.scss';

const mapStateToProps = (state, props) => ({
  uid: state.firebase.auth.uid,
  tasks: state.firestore.ordered[`${props.clientId}_tasks`],
});

/**
 * Query the "task" subcollection for the current user.
 *
 * @param {string} uid      ID of the current user.
 * @param {string} clientId ID of the client.
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
          where: [['client', '==', clientId], ['status', '==', 'active']],
        },
      ],
      storeAs: `${clientId}_tasks`,
    },
  ];
};

const TaskList = ({ tasks }) => {
  if (!tasks) {
    return null;
  }

  const total = computeTotal(tasks);

  return (
    <>
      <ul className="TaskList">
        <TaskRow className="header" description="Description" hours="Hours" price="Price" />
        {tasks.map(({ id, description, hours, price }) => (
          <TaskRow
            key={id}
            description={description}
            hours={hours || '-'}
            price={formatPrice(price)}
          />
        ))}
      </ul>

      <p>Billable {formatPrice(total)}</p>
    </>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(taskQuery),
)(TaskList);
