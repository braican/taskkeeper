const faunadb = require('faunadb');
const q = faunadb.query;

const addInvoice = async ({ secret, invoice }) => {
  const faunaClient = new faunadb.Client({ secret });

  const newInvoice = await faunaClient.query(
    q.Create(q.Collection('Invoice'), {
      data: {
        ...invoice,
        client: q.Ref(q.Collection('Client'), invoice.client),
        uid: q.CurrentIdentity(),
      },
    }),
  );

  return { ...newInvoice.data, id: newInvoice.ref.id, client: newInvoice.data.client.id };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const newInvoice = await addInvoice(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, invoice: newInvoice }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
