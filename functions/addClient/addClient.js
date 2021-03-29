const faunadb = require('faunadb');
const q = faunadb.query;

const getUser = async secret => {
  try {
    const faunaClient = new faunadb.Client({ secret });
    const result = await faunaClient.query(
      q.Get(q.Ref(q.Collection('User'), '294234943141184009')),
      // q.Get(q.Ref(q.Collection('User'), '294234877260202509')),
    );
    console.log('it worked. The result:');
    console.log(result);
    console.log('\n');
  } catch (error) {
    console.log('It didnt work, as it shouldnt have.');
    console.log(error);
    console.log('\n');
  }
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const { secret } = data;

    await getUser(secret);
    return {
      statusCode: 200,
      body: JSON.stringify({ hello: 'test' }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
