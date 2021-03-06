import React from 'react';
import PropTypes from 'prop-types';

const FormattedPrice = ({ price, className }) => {
  const priceNumber = parseFloat(price);

  if (isNaN(priceNumber)) {
    return <span>$0</span>;
  }

  const priceString = priceNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const dollars = priceString.slice(0, priceString.length - 2).replace('.', '');
  const cents = priceString.slice(-2);

  return (
    <span className={className}>
      ${dollars}
      {cents !== '00' && (
        <>
          .<sup className="cents">{cents}</sup>
        </>
      )}
    </span>
  );
};

FormattedPrice.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

FormattedPrice.defaultProps = {
  className: null,
};

export default FormattedPrice;
