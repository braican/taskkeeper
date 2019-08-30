import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

import { TaskContext } from '../index';

const Description = ({ value, className }) => {
  const initialValue = value;
  const { taskRef, handleSave } = useContext(TaskContext);
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState(value);

  const handleUpdate = event => {
    if (!taskRef) {
      return;
    }

    const newDescription = event.target.innerHTML;

    // Don't need to save if the value didn't change.
    if (newDescription === initialValue) {
      return;
    }

    setIsSaving(true);

    taskRef.update({ description: newDescription }).then(() => {
      setIsSaving(false);

      if (typeof handleSave === 'function') {
        handleSave();
      }
    });
  };

  return (
    <ContentEditable
      html={description}
      disabled={isSaving}
      className={className}
      tagName="p"
      onChange={event => setDescription(event.target.value)}
      onBlur={handleUpdate}
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
