import React, { useContext } from 'react';

import ClientContext from '../../contexts/ClientContext';

import formatPrice from '../../util/formatPrice';

import './ClientHeader.scss';

const ClientHeader = () => {
  const { name, rate } = useContext(ClientContext);
  return (
    <header className="ClientHeader">
      <h1 className="client-name">{name}</h1>
      <dl>
        <dd>Hourly rate</dd>
        <dt>{formatPrice(rate)}</dt>

        <dd>Outstanding</dd>
        <dt />
      </dl>
    </header>
  );
};

export default ClientHeader;
