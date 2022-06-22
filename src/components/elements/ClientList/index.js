import React from 'react';
import { useClients, useTasks, useInvoices } from 'hooks';

import Placard from 'components/ui/Placard';
import { TASK_STATUS } from 'constants.js';

import styles from './ClientList.module.scss';

const ClientList = () => {
  const { clients } = useClients();
  const { tasks } = useTasks();
  const { activeInvoices } = useInvoices();

  const activeClientIds = [
    ...new Set(tasks.map(t => t.client)),
    ...new Set(activeInvoices.map(i => i.client)),
  ];
  const actives = [];
  const inactives = [];

  Object.keys(clients).forEach(clientId => {
    if (activeClientIds.includes(clientId)) {
      actives.push(clients[clientId]);
    } else {
      inactives.push(clients[clientId]);
    }
  });

  return (
    <div className={styles.clientlist}>
      <div className={styles.activeClients}>
        <h2 className={styles.headline}>Active Clients</h2>
        {actives.length > 0 ? (
          <ul>
            {actives.map(client => {
              const clientTasks = tasks.filter(t => t.client === client.id);
              const estimated = clientTasks.filter(t => t.status === TASK_STATUS.estimated).length;
              const todo = clientTasks.filter(t => t.status === TASK_STATUS.todo).length;
              const completed = clientTasks.filter(t => t.status === TASK_STATUS.completed).length;
              const clientInvoices = activeInvoices.filter(i => i.client === client.id).length;

              return (
                <li key={client.id} className={styles.clientItem}>
                  <Placard to={`client/${client.id}`}>
                    <div className={styles.activeClient}>
                      <span className={styles.clientName}>{client.name}</span>
                      <span className={styles.rate}>${client.rate}</span>

                      {clientInvoices > 0 && (
                        <span>
                          {clientInvoices} active invoice{clientInvoices > 1 ? 's' : ''}
                        </span>
                      )}

                      <div className={styles.taskCount}>
                        {estimated > 0 && <p>{estimated} estimated</p>}
                        {todo > 0 && <p>{todo} todo</p>}
                        {completed > 0 && <p>{completed} completed</p>}
                      </div>
                    </div>
                  </Placard>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No active clients</p>
        )}
      </div>

      {inactives.length > 0 && (
        <div className={styles.inactiveClients}>
          <h2 className={styles.headline}>Inactives</h2>
          <ul>
            {inactives.map(client => (
              <li key={client.id}>
                <Placard to={`client/${client.id}`} minimal>
                  <span className={styles.clientName}>{client.name}</span>
                  <span className={styles.rate}>${client.rate}</span>
                </Placard>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientList;
