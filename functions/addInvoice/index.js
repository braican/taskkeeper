const faunadb = require('faunadb');
const q = faunadb.query;

const addInvoice = async ({ secret, invoice }) => {
  const faunaClient = new faunadb.Client({ secret });

  const modTasks = [...invoice.tasks].map(t => {
    const newT = { ...t };
    delete newT.uid;
    delete newT.client;
    return newT;
  });

  const modInvoice = { ...invoice, tasks: modTasks };

  try {
    const newInvoice = await faunaClient.query(
      q.Create(q.Collection('Invoice'), {
        data: {
          ...modInvoice,
          client: q.Ref(q.Collection('Client'), invoice.client),
          uid: q.CurrentIdentity(),
        },
      }),
    );

    return { ...newInvoice.data, id: newInvoice.ref.id, client: newInvoice.data.client.id };
  } catch (error) {
    return null;
  }
};

const deleteTasks = async ({ secret, invoice }) => {
  const faunaClient = new faunadb.Client({ secret });

  try {
    await faunaClient.query(
      q.Map(
        invoice.tasks.map(({ id }) => id),
        q.Lambda('id', q.Delete(q.Ref(q.Collection('Task'), q.Var('id')))),
      ),
    );
    return true;
  } catch (error) {
    return false;
  }
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const newInvoice = await addInvoice(data);

    if (newInvoice === null) {
      return {
        statusCode: 500,
        body: 'NEW INVOICE IS NULL',
      };
    }

    const deleteSuccess = await deleteTasks(data);

    if (!deleteSuccess) {
      return {
        statusCode: 500,
        body: 'DELETE SUCCESS FAILED',
      };
    }

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
