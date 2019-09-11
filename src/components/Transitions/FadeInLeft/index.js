import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles from './FadeInLeft.module.scss';

const FadeInLeft = ({ in: inCondition, timeout, children }) => (
  <CSSTransition in={inCondition} timeout={timeout} classNames={{ ...styles }} unmountOnExit>
    {children}
  </CSSTransition>
);

FadeInLeft.propTypes = {
  in: PropTypes.bool.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  children: PropTypes.node,
};

FadeInLeft.defaultProps = {
  timeout: 200,
  children: null,
};

export default FadeInLeft;
