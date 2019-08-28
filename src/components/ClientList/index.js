import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const ClientList = ({ clients }) => (
  <section>
    <h2>Client list</h2>
    {clients && clients.length > 0 ? (
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            <Link to={`/client/${client.id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
    ) : (
      <p>No clients</p>
    )}
  </section>
);

ClientList.defaultProps = {
  clients: [],
};

ClientList.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  ),
};

export default compose(connect(({ firestore }) => ({ ...firestore.ordered })))(ClientList);
