import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import baseStyles from './FadeInUp-base.module.scss';
import immediateOutStyles from './FadeInUp-immediateOut.module.scss';

const FadeInUp = ({ in: inCondition, timeout, immediateOut, children }) => {
  const styles = immediateOut ? immediateOutStyles : baseStyles;

  return (
    <CSSTransition in={inCondition} timeout={timeout} classNames={{ ...styles }} unmountOnExit>
      {children}
    </CSSTransition>
  );
};

FadeInUp.propTypes = {
  in: PropTypes.bool.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  immediateOut: PropTypes.bool,
  children: PropTypes.node,
};

FadeInUp.defaultProps = {
  timeout: 200,
  immediateOut: false,
  children: null,
};

export default FadeInUp;
