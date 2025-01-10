// app/dashboard/page.tsx
'use client';

import Button from '@/components/button';
import { useGlobals } from '@/contexts/GlobalContext';

export default function Dashboard() {
  const { toggleNewClientFormVisible } = useGlobals();

  return (
    <div>
      <h1>Dashboard</h1>

      <Button onClick={toggleNewClientFormVisible}>Add new client</Button>
    </div>
  );
}
