import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles from './FadeIn.module.scss';

const FadeIn = ({ in: inCondition, timeout, children }) => (
  <CSSTransition in={inCondition} timeout={timeout} classNames={{ ...styles }} unmountOnExit>
    {children}
  </CSSTransition>
);

FadeIn.propTypes = {
  in: PropTypes.bool.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  children: PropTypes.node,
};

FadeIn.defaultProps = {
  timeout: 200,
  children: null,
};

export default FadeIn;
