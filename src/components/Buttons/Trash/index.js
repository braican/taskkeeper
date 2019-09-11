import React from 'react';
import PropTypes from 'prop-types';

import InlineButton from '../Inline';
import TrashIcon from '../../../svg/Trash';

import styles from './TrashButton.module.scss';

const TrashButton = ({ onClick }) => (
  <InlineButton onClick={onClick} icon={TrashIcon} className={styles.button} />
);

TrashButton.propTypes = {
  onClick: PropTypes.func,
};

TrashButton.defaultProps = {
  onClick: null,
};

export default TrashButton;
