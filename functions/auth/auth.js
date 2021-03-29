// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { OAuth2Client } = require('google-auth-library');
const faunadb = require('faunadb');
const { Logout } = require('faunadb');
const faunaClient = new faunadb.Client({ secret: process.env.FAUNA_SERVER_KEY });
const q = faunadb.query;

/**
 * Authenticate with Google.
 * @param {string} token Google client-side token.
 * @returns object
 */
const authenticateWithGoogle = async token => {
  try {
    const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    });

    const { sub: uid, name, picture, email } = ticket.getPayload();

    return { uid, name, picture, email };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Fetch a user from Fauna by their Google UID.
 * @param {string} uid Uinque ID for the user, from Google.
 * @returns object|null (if there is no user)
 */
const fetchUser = async uid => {
  try {
    const user = await faunaClient.query(q.Get(q.Match(q.Index('users_by_uid'), uid)));
    return user;
  } catch (error) {
    if (error.requestResult.statusCode === 404) {
      return null;
    }

    throw new Error(error.description);
  }
};

/**
 * Add a user to Fauna.
 * @param {object} data User data.
 * @return object
 */
const addUser = async data => {
  try {
    const user = await faunaClient.query(
      q.Create(q.Collection('User'), {
        data: { ...data },
      }),
    );

    return user;
  } catch (error) {
    throw new Error(error.description);
  }
};

/**
 * Fetches the user from Fauna, adding them if necessary.
 * @param {object} data User data from Google.
 * @return void
 */
const getFaunaUser = async data => {
  const user = await fetchUser(data.uid);

  if (user) {
    /* eslint-disable-next-line */
    console.log('User found!\n');
    return user;
  }

  /* eslint-disable-next-line */
  console.log('Adding user...!\n');
  return await addUser(data);
};

/**
 * Log into Fauna with the provided user data and
 * @param {object} data User data.
 * @return string
 */
const loginToFauna = async ref => {
  try {
    const token = await faunaClient.query(q.Create(q.Tokens(), { instance: ref }));
    return token;
  } catch (error) {
    throw new Error(error.description);
  }
};

const handler = async ({ body }) => {
  try {
    const data = JSON.parse(body);
    const { token } = data;

    const googleData = await authenticateWithGoogle(token);
    const { data: userData, ref } = await getFaunaUser(googleData);
    const { secret } = await loginToFauna(ref);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...userData, secret }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
