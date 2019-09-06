import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { className } from '../../../utils';

import Tasklist from '../Tasklist';
import TaskUtility from './TaskUtility';
import AddInvoice from '../../AddInvoice';
import FadeInUp from '../../Transitions/FadeInUp';

import styles from './CompletedTasks.module.scss';

const CompletedTasks = ({ tasks, isInvoicing, setInvoicing }) => {
  const noTasks = (
    <p>
      No outstanding tasks{' '}
      <span className="emoji" role="img" aria-label="Nice work">
        🌮
      </span>
    </p>
  );

  return (
    <>
      <Tasklist
        headline="Completed Tasks"
        tasks={tasks}
        noTasksMessage={noTasks}
        utility={TaskUtility}
        canInvoice
      />

      <FadeInUp in={isInvoicing}>
        <AddInvoice />
      </FadeInUp>

      <div {...className(styles.actions, isInvoicing && styles.actionHidden)}>
        <button type="button" className="button" onClick={setInvoicing}>
          Start an invoice
        </button>
      </div>
    </>
  );
};

CompletedTasks.propTypes = {
  tasks: PropTypes.array,
  isInvoicing: PropTypes.bool,
  setInvoicing: PropTypes.func.isRequired,
};

CompletedTasks.defaultProps = {
  tasks: [],
  isInvoicing: false,
};

export default compose(
  connect(
    ({ invoice: { isInvoicing } }) => ({ isInvoicing }),
    dispatch => ({ setInvoicing: () => dispatch({ type: 'SET_INVOICING' }) }),
  ),
)(CompletedTasks);
