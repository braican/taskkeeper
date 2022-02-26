const faunadb = require('faunadb');
const q = faunadb.query;

const getInvoices = async secret => {
  try {
    const faunaClient = new faunadb.Client({ secret });
    const result = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('invoices_by_uid'), [q.CurrentIdentity()])),
        q.Lambda('x', q.Get(q.Var('x'))),
      ),
    );

    return result.data.map(
      ({ ref, data: { description, total, status, issued, due, rate, tasks, client } }) => ({
        description,
        total,
        status,
        issued,
        due,
        rate,
        tasks,
        client: client.id,
        id: ref.id,
      }),
    );
  } catch (error) {
    if (error.requestResult.statusCode === 404) {
      console.error('No invoices found.');
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

    const tasks = await getInvoices(secret);

    return {
      statusCode: 200,
      body: JSON.stringify({ tasks }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
