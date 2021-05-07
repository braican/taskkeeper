import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';

const Dashboard = () => (
  <div>
    <section className="section">
      <h2>Client list</h2>
      <AddClient />
      <ClientList />
    </section>
  </div>
);

export default Dashboard;
