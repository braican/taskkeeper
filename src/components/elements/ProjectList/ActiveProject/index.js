import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isDarkBackground } from 'util/index.js';
import FormInput from 'components/ui/FormInput';

import styles from './ActiveProject.module.scss';

const ActiveProject = ({ color = '#eeeeee', name }) => {
  const [inputColor, setColor] = useState(color);

  const handleBlur = event => {
    console.log(event.target.value);
  };

  return (
    <div className={styles.project}>
      <span
        className={styles.pill}
        style={{
          backgroundColor: inputColor,
          color: inputColor && isDarkBackground(inputColor) ? '#ffffff' : '#000000',
        }}>
        {name}
      </span>

      <FormInput type="color" onBlur={handleBlur} defaultValue={inputColor} />
    </div>
  );
};

ActiveProject.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
};

export default ActiveProject;
