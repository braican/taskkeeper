import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ClientContext } from 'contexts';

const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  return (
    <ClientContext.Provider value={{ clients, setClients }}>{children}</ClientContext.Provider>
  );
};

ClientProvider.propTypes = {
  children: PropTypes.node,
};

export default ClientProvider;
