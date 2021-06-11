const faunadb = require('faunadb');
const q = faunadb.query;

const addProject = async ({ secret, project }) => {
  const faunaClient = new faunadb.Client({ secret });

  const newProject = await faunaClient.query(
    q.Create(q.Collection('Project'), {
      data: {
        ...project,
        client: q.Ref(q.Collection('Client'), project.client),
        uid: q.CurrentIdentity(),
      },
    }),
  );

  return { ...newProject.data, id: newProject.ref.id, client: newProject.data.client.id };
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const newProject = await addProject(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, project: newProject }),
    };
  } catch (error) {
    return {
      statusCode: error?.requestResult?.statusCode || 500,
      body: error.description || error.toString(),
    };
  }
};

module.exports = { handler };
