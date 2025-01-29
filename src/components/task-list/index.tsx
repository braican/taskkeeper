import TaskItem from '../task-item';
import { Client, Task } from '@/types';

export default function TaskList({
  client,
  tasks = [],
}: {
  client: Client;
  tasks: Task[];
}) {
  if (tasks.length < 1) {
    return <p>No tasks here.</p>;
  }

  return (
    <ul className="ul-reset">
      {tasks.map((task) => (
        <li key={task.id} className="mt-m">
          <TaskItem task={task} rate={Number(client.rate)} />
        </li>
      ))}
    </ul>
  );
}
