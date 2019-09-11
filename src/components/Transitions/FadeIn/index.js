import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import baseStyles from './FadeIn.module.scss';
import immediateOutStyles from './FadeIn-immediateOut.module.scss';

const FadeIn = ({ in: inCondition, timeout, immediateOut, children }) => {
  const styles = immediateOut ? immediateOutStyles : baseStyles;
  return (
    <CSSTransition in={inCondition} timeout={timeout} classNames={{ ...styles }} unmountOnExit>
      {children}
    </CSSTransition>
  );
};

FadeIn.propTypes = {
  in: PropTypes.bool.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  immediateOut: PropTypes.bool,
  children: PropTypes.node,
};

FadeIn.defaultProps = {
  timeout: 200,
  immediateOut: false,
  children: null,
};

export default FadeIn;
