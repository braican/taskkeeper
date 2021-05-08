import React from 'react';
import { ClientProvider } from 'providers';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';

const Dashboard = () => (
  <div>
    <section className="section">
      <ClientProvider>
        <h2>Client list</h2>
        <AddClient />
        <ClientList />
      </ClientProvider>
    </section>
  </div>
);

export default Dashboard;
