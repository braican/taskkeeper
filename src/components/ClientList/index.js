import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

const ClientList = ({ clients }) => (
  <section>
    <h2>Client list</h2>
    {clients && clients.length > 0 && (
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
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
