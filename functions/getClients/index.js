const faunadb = require('faunadb');
const q = faunadb.query;

const getClients = async secret => {
  try {
    const faunaClient = new faunadb.Client({ secret });
    const result = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('clients_by_uid'), q.CurrentIdentity())),
        q.Lambda('x', q.Get(q.Var('x'))),
      ),
    );

    return result.data.map(({ ref, data: { key, name, rate, status, address } }) => ({
      key,
      name,
      rate,
      status,
      address,
      id: ref.id,
    }));
  } catch (error) {
    if (error.requestResult.statusCode === 404) {
      console.error('No clients found.');
    } else {
      console.error(error);
    }

    return [];
  }
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const { secret } = data;

    const clients = await getClients(secret);

    return {
      statusCode: 200,
      body: JSON.stringify({ clients }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
