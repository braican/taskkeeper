const faunadb = require('faunadb');
const q = faunadb.query;

const addTask = async ({ secret, task }) => {
  const faunaClient = new faunadb.Client({ secret });

  const newTask = await faunaClient.query(
    q.Create(q.Collection('Task'), {
      data: {
        ...task,
        client: q.Ref(q.Collection('Client'), task.client),
        uid: q.CurrentIdentity(),
      },
    }),
  );

  return { ...newTask.data, id: newTask.ref.id, client: newTask.data.client.id };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const newTask = await addTask(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, task: newTask }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
