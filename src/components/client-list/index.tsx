import { useGlobals } from '@/contexts/GlobalContext';

export default function ClientList() {
  const { clients, areClientsLoaded } = useGlobals();

  if (!areClientsLoaded) {
    return <p>Loading clients...</p>;
  }

  if (clients.length < 1) {
    return <p>No clients</p>;
  }

  return (
    <ul>
      {clients.map((client) => (
        <li key={client.id}>{client.name}</li>
      ))}
    </ul>
  );
}
