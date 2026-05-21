// middlewares/auth.js — JWT Bearer token verification
'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

/**
 * Express middleware: validates Authorization: Bearer <token>
 * and attaches decoded payload to req.user.
 *
 * Payload shape expected after sign:
 *   { sub: creatorHandle, youtubeChannelId, wallet, iat, exp }
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // Normalise the payload surface exposed to route handlers
    req.user = {
      handle: payload.sub,
      youtubeChannelId: payload.youtubeChannelId || null,
      wallet: payload.wallet || null,
    };

    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    return res.status(403).json({ error: 'Invalid token.' });
  }
}

/**
 * Utility: sign a JWT for a claimed creator.
 * @param {object} payload - { handle, youtubeChannelId, wallet }
 * @returns {string} signed JWT
 */
function signCreatorJWT({ handle, youtubeChannelId, wallet }) {
  return jwt.sign(
    { sub: handle, youtubeChannelId, wallet },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' }
  );
}

module.exports = { authenticateJWT, signCreatorJWT };
