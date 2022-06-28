// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { OAuth2Client } = require('google-auth-library');
const faunadb = require('faunadb');
const faunaClient = new faunadb.Client({ secret: process.env.FAUNA_SERVER_KEY });
const q = faunadb.query;

const client = new OAuth2Client(
  process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  'postmessage',
);

const authorizeGoogleClient = async code => {
  try {
    const { tokens } = await client.getToken(code);
    return tokens.refresh_token;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get user data.
 *
 */
const getGoogleUser = async () => {
  try {
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo';
    const {
      data: { id: uid, name, picture, email, given_name: firstName },
    } = await client.request({ url });
    return { uid, name, picture, email, firstName };
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
    return user;
  }

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
    const refreshToken = data.code ? await authorizeGoogleClient(data.code) : data.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token provided.');
    }

    client.setCredentials({ refresh_token: refreshToken });

    const googleData = await getGoogleUser();

    const { data: userData, ref } = await getFaunaUser(googleData);
    const { secret } = await loginToFauna(ref);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...userData, secret, refreshToken }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
