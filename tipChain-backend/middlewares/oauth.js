// middlewares/oauth.js — Google/YouTube OAuth token validation
'use strict';

const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  throw new Error('Google OAuth env variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI) are not fully set.');
}

const oauthClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

/**
 * Exchange an authorization code for tokens and fetch the
 * authenticated user's YouTube channel information.
 *
 * @param {string} code - OAuth2 authorization code from callback
 * @returns {Promise<{ accessToken, idToken, channelId, channelTitle, email }>}
 */
async function exchangeCodeForProfile(code) {
  // Exchange code → tokens
  const { tokens } = await oauthClient.getToken(code);
  oauthClient.setCredentials(tokens);

  // Verify the ID token to extract the Google account identity
  const ticket = await oauthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });

  const googlePayload = ticket.getPayload();
  const email = googlePayload.email;

  // Fetch the YouTube channel linked to this Google account
  const channelData = await fetchYouTubeChannel(tokens.access_token);

  return {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    channelId: channelData.channelId,
    channelTitle: channelData.channelTitle,
    email,
  };
}

/**
 * Validate an existing access token and return the linked
 * YouTube channel identity. Used for re-validation flows.
 *
 * @param {string} accessToken
 * @returns {Promise<{ channelId, channelTitle }>}
 */
async function validateAccessToken(accessToken) {
  // Confirm token is still valid with Google's tokeninfo endpoint
  const tokenInfo = await oauthClient.getTokenInfo(accessToken);
  if (!tokenInfo || !tokenInfo.email) {
    throw new Error('Invalid or expired Google access token.');
  }
  return fetchYouTubeChannel(accessToken);
}

/**
 * Internal: hit YouTube Data API v3 to resolve the channel for a token.
 *
 * @param {string} accessToken
 * @returns {Promise<{ channelId, channelTitle }>}
 */
async function fetchYouTubeChannel(accessToken) {
  const url =
    'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true';

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!resp.ok) {
    throw new Error(`YouTube API error: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found for this Google account.');
  }

  const channel = data.items[0];
  return {
    channelId: channel.id,
    channelTitle: channel.snippet.title,
  };
}

/**
 * Build the Google OAuth2 consent URL (used by the claim route
 * to redirect the creator to Google for authorization).
 */
function getAuthorizationUrl(state) {
  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
    state, // pass creator handle or nonce for CSRF protection
  });
}

module.exports = {
  exchangeCodeForProfile,
  validateAccessToken,
  getAuthorizationUrl,
};
