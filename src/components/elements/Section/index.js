import React from 'react';
import PropTypes from 'prop-types';

import styles from './Section.module.scss';

const Section = ({ headline, children, headerOffset = '', minHeight = '' }) => (
  <section className={styles.section} style={minHeight ? { minHeight: minHeight } : null}>
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
};

export default Section;
