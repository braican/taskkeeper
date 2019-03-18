import React, { useContext } from 'react';

import ClientContext from '../../contexts/ClientContext';

import formatPrice from '../../util/formatPrice';

const ClientHeader = () => {
  const { name, rate } = useContext(ClientContext);
  return (
    <>
      <h1>{name}</h1>
      <p>Hourly rate: {formatPrice(rate)}</p>
    </>
  );
};

export default ClientHeader;
