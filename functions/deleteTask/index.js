const faunadb = require('faunadb');
const q = faunadb.query;

const handler = async ({ body }) => {
  try {
    const { secret, id } = JSON.parse(body);
    const faunaClient = new faunadb.Client({ secret });
    await faunaClient.query(q.Delete(q.Ref(q.Collection('Task'), id)));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
