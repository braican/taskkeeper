import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  clients: state.clients,
});

const ClientList = connect(mapStateToProps)(({ clients }) => {
  return (
    <div>
      <h2>Client List</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
});

ClientList.propTypes = {
  clients: PropTypes.array,
};

export default ClientList;
