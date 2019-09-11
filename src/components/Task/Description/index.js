import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

import { TaskContext } from '../index';

const Description = ({ value, className }) => {
  const initialValue = value;
  const { handleSave, handleInputFocus } = useContext(TaskContext);
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState(value);

  const handleBlur = event => {
    if (typeof handleSave !== 'function') {
      return;
    }

    const newDescription = event.target.innerHTML;
    const shouldSave = newDescription !== initialValue;

    setIsSaving(true);

    handleSave({ description: newDescription }, shouldSave).then(() => {
      setIsSaving(false);
    });
  };

  return (
    <ContentEditable
      html={description}
      disabled={isSaving}
      className={className}
      tagName="p"
      onFocus={handleInputFocus}
      onChange={event => setDescription(event.target.value)}
      onBlur={handleBlur}
    />
  );
};

Description.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
};

Description.defaultProps = {
  value: '',
};

export default Description;
