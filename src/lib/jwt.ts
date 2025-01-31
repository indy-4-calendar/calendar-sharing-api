import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '@/constants';
import logger from '@/lib/logger';

/**
 * Create a new access token for a user, sign it with
 * a private key, and return it
 */
const createAccessToken = (userId: string) => {
  const privateKey = config.JWTAccessTokenPrivateKey;
  const rsaKey = Buffer.from(privateKey, 'base64').toString();
  const data = { userId };

  const token = jwt.sign(data, rsaKey, {
    algorithm: 'RS256',
    expiresIn: config.JWTAccessTokenExpirationTime,
  });

  logger.debug(`Created access token for user ${userId}`);
  return token;
};

/**
 * Create refresh token for a user, sign it with a private key,
 * and return it
 */
const createRefreshToken = (userId: string) => {
  const privateKey = config.JWTRefreshTokenPrivateKey;
  const rsaKey = Buffer.from(privateKey, 'base64').toString();
  const data = { userId };

  const token = jwt.sign(data, rsaKey, {
    algorithm: 'RS256',
    expiresIn: config.JWTRefreshTokenExpirationTime,
  });

  logger.debug(`Created refresh token for user ${userId}`);
  return token;
};

/**
 * Validate an access token, ensure it is signed, then
 * decode it and return the payload
 */
const verifyAccessToken = (token: string) => {
  const publicKey = config.JWTAccessTokenPublicKey;
  const rsaKey = Buffer.from(publicKey, 'base64').toString();

  let decoded: JwtPayload | string;
  try {
    decoded = jwt.verify(token, rsaKey, {
      algorithms: ['RS256'],
    });
  } catch (error: any) {
    logger.error('Error verifying access token');
    logger.error(error);

    return error.name === 'TokenExpiredError' ? 'expired' : null;
  }

  return decoded;
};

/**
 * Validate a refresh token, ensure it is signed, then
 * decode it and return the payload
 */
const verifyRefreshToken = (token: string) => {
  const publicKey = config.JWTRefreshTokenPublicKey;
  const rsaKey = Buffer.from(publicKey, 'base64').toString();

  let decoded: JwtPayload | string;
  try {
    decoded = jwt.verify(token, rsaKey, {
      algorithms: ['RS256'],
    });
  } catch (error: any) {
    logger.error('Error verifying refresh token');
    logger.error(error);

    return error.name === 'TokenExpiredError' ? 'expired' : null;
  }

  return decoded;
};

export default {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
