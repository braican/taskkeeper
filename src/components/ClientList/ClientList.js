import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  clients: state.clients,
});

const ClientList = ({ clients }) => (
  <div>
    <h2>Client List</h2>
    <ul>
      {clients.map(client => (
        <li key={client.name}>{client.name}</li>
      ))}
    </ul>
  </div>
);

ClientList.propTypes = {
  clients: PropTypes.array,
};

export default connect(mapStateToProps)(ClientList);
