import React from 'react';
import PropTypes from 'prop-types';
import CompleteSvg from '../../../svg/Complete';

import styles from './Complete.module.scss';

const CompleteButton = ({ onClick }) => (
  <button className={styles.button} onClick={onClick}>
    <CompleteSvg />
  </button>
);

CompleteButton.defaultProps = {
  onClick: null,
};

CompleteButton.propTypes = {
  onClick: PropTypes.func,
};

export default CompleteButton;
