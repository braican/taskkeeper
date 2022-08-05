const faunadb = require('faunadb');
const q = faunadb.query;

const updateInvoice = async ({ secret, id, ...data }) => {
  const faunaClient = new faunadb.Client({ secret });

  const updatedInvoice = await faunaClient.query(
    q.Update(q.Ref(q.Collection('Invoice'), id), {
      data: {
        ...data,
        client: q.Ref(q.Collection('Client'), data.client),
        uid: q.CurrentIdentity(),
      },
    }),
  );

  return {
    ...updatedInvoice.data,
    id: updatedInvoice.ref.id,
    client: updatedInvoice.data.client.id,
  };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const updatedInvoice = await updateInvoice(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, invoice: updatedInvoice }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
