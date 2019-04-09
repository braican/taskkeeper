import React from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../../util/formatPrice';

const RowData = ({ description, hours, price, isEditing }) => (
  <>
    <span className="cell description">
      {isEditing ? (
        <input
          type="text"
          defaultValue={description.get}
          onChange={e => description.set(e.target.value)}
        />
      ) : (
        description.get
      )}
    </span>
    <span className="cell hours">
      {isEditing && hours.get !== '-' ? (
        <input type="number" defaultValue={hours.get} onChange={e => hours.set(e.target.value)} />
      ) : (
        hours.get
      )}
    </span>
    <span className="cell price">
      {isEditing && hours.get === '-' ? (
        <input type="number" defaultValue={price.get} onChange={e => price.set(e.target.value)} />
      ) : (
        formatPrice(price.get)
      )}
    </span>
  </>
);

RowData.propTypes = {
  description: PropTypes.shape({
    get: PropTypes.string,
    set: PropTypes.func,
  }),
  hours: PropTypes.shape({
    get: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    set: PropTypes.func,
  }),
  price: PropTypes.shape({
    get: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element]),
    set: PropTypes.func,
  }),
  isEditing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default RowData;
