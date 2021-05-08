const faunadb = require('faunadb');
const q = faunadb.query;

const addClient = async ({ secret, client }) => {
  const faunaClient = new faunadb.Client({ secret });
  const newClient = await faunaClient.query(
    q.Create(q.Collection('Client'), { data: { ...client, uid: q.CurrentIdentity() } }),
  );

  return { ...newClient.data, id: newClient.ref.id };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);

    const newClient = await addClient(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, client: newClient }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
