const faunadb = require('faunadb');
const q = faunadb.query;

const updateTask = async ({ secret, id, ...data }) => {
  const faunaClient = new faunadb.Client({ secret });
  const updatedTask = await faunaClient.query(q.Update(q.Ref(q.Collection('Task'), id), { data }));

  return { ...updatedTask.data, id: updatedTask.ref.id, client: updatedTask.data.client.id };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const updatedTask = await updateTask(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, task: updatedTask }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
