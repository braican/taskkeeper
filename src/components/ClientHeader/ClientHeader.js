import React, { useContext } from 'react';

import ClientContext from '../../contexts/ClientContext';

import formatPrice from '../../util/formatPrice';

import './ClientHeader.scss';

const ClientHeader = () => {
  const { name, rate } = useContext(ClientContext);
  return (
    <header className="ClientHeader">
      <h1 className="client-name">{name}</h1>

      <div className="data">
        <div className="">
          <dl>
            <dd>Hourly rate</dd>
            <dt>{formatPrice(rate)}</dt>
          </dl>
        </div>

        {/* <div className="unbilled">
          <dl>
            <dd>Estimated Balance</dd>
            <dt>{formatPrice(estimatedBalance)}</dt>
            <dd>Unbilled Hours</dd>
            <dt>{formatPrice(estimatedBalance)}</dt>
          </dl>
        </div> */}
      </div>
    </header>
  );
};

export default ClientHeader;
