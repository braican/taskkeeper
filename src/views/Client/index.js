import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useClients } from 'hooks';

const Client = () => {
  const { id } = useParams();
  const { client } = useClients(id);

  return (
    <div className="section">
      <Link to="/dashboard">&larr; Dashboard</Link>
      <section>
        <h2>{client.name}</h2>
      </section>
    </div>
  );
};

export default Client;
