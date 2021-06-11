const faunadb = require('faunadb');
const q = faunadb.query;

const getProjects = async secret => {
  try {
    const faunaClient = new faunadb.Client({ secret });
    const result = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('projects_by_uid'), [q.CurrentIdentity()])),
        q.Lambda('x', q.Get(q.Var('x'))),
      ),
    );

    return result.data.map(({ ref, data: { name, color, status, client } }) => ({
      name,
      status,
      color,
      client: client.id,
      id: ref.id,
    }));
  } catch (error) {
    if (error.requestResult.statusCode === 404) {
      console.error('No projects found.');
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

    const projects = await getProjects(secret);

    return {
      statusCode: 200,
      body: JSON.stringify({ projects }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
