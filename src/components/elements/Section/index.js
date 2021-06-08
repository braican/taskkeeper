import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Section.module.scss';

const Section = ({ headline, children, headerOffset = '', minHeight = '', className = '' }) => (
  <section
    className={classnames(styles.section, className)}
    style={minHeight ? { minHeight: minHeight } : null}>
    <h2 className={styles.headline} style={headerOffset ? { top: headerOffset } : null}>
      {headline}
    </h2>
    {children}
  </section>
);

Section.propTypes = {
  headline: PropTypes.string,
  children: PropTypes.node,
  headerOffset: PropTypes.string,
  minHeight: PropTypes.string,
  className: PropTypes.string,
};

export default Section;
