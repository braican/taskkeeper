import React from 'react';
import PropTypes from 'prop-types';

import styles from './Section.module.scss';

const Section = ({ headline, children }) => (
  <section className={styles.section}>
    <h2 className={styles.headline}>{headline}</h2>
    {children}
  </section>
);

Section.propTypes = {
  headline: PropTypes.string,
  children: PropTypes.node,
};

export default Section;
