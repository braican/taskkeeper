const faunadb = require('faunadb');
const q = faunadb.query;

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const { secret } = data;
    const client = new faunadb.Client({ secret });
    await client.query(q.Logout(false));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logged out.' }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
