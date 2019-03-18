import React from 'react';
import PropTypes from 'prop-types';

import './Toggler.scss';

const Toggler = ({ onLabel, offLabel, onChange, isOn }) => {
  return (
    <div className="Toggler">
      <button
        type="button"
        className={`label${isOn ? ' label--disabled' : ''}`}
        onClick={() => onChange(false)}
        tabIndex="-1">
        {onLabel}
      </button>

      <input
        type="checkbox"
        className="control"
        id="task-unit-toggle"
        checked={isOn}
        onChange={e => onChange(e.target.checked)}
      />
      <label className="track" htmlFor="task-unit-toggle">
        &nbsp;
      </label>

      <button
        type="button"
        className={`label${!isOn ? ' label--disabled' : ''}`}
        onClick={() => onChange(true)}
        tabIndex="-1">
        {offLabel}
      </button>
    </div>
  );
};

Toggler.propTypes = {
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
  onChange: PropTypes.func,
  isOn: PropTypes.bool,
};

export default Toggler;
