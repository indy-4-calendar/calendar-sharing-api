import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';

import apple from '@/lib/apple';
import config from '@/constants';
import User from '@/models/user';
import Calendar from '@/models/calendar';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import { ISanitizedUser } from '@/models/@types';
import { APIError, errorWrapper } from '@/lib/error';

interface AppleTokenSchema {
  /** The issuer of the token */
  iss: string;
  /** The audience of the token (app bundle id) */
  aud: string;
  /** When the token expires */
  exp: number;
  /** When the token was issued */
  iat: number;
  /** The subject of the token (unique user id) */
  sub: string;
  /** The email of the user */
  email: string;
  /** Whether the email is verified */
  email_verified: boolean | 'true' | 'false';
}

type Response = IResponse<{
  user: ISanitizedUser;
  accessToken: string;
  refreshToken: string;
}>;

/**
 * Endpoint:     POST /api/v1/auth/apple
 * Description:  Login or register using Apple OAuth
 */
export default async (req: Request): Promise<Response> => {
  const schema = z.object({
    identityToken: z.string(),
    fullName: z
      .object({
        givenName: validators.firstName.nullable(),
        familyName: validators.lastName.nullable(),
      })
      .nullable(),
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { identityToken, fullName } = params.data;

  // #region Validate Apple JWT
  const header = jwt.decode(identityToken, { complete: true })?.header;

  if (!header) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 2,
      humanMessage: 'Invalid OAuth token',
    });
  }

  const tokenKid = header.kid;

  if (!tokenKid) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 3,
      humanMessage: 'Invalid OAuth token',
    });
  }

  const applePublicKey = await errorWrapper(4, async () => {
    return apple.getPublicKey(tokenKid);
  });

  const kid = applePublicKey.kid;

  const client = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    timeout: 30000,
  });

  const publicKey = await errorWrapper(5, async () => {
    return (await client.getSigningKey(kid)).getPublicKey();
  });

  const decoded = await errorWrapper(6, async () => {
    return jwt.verify(identityToken, publicKey) as AppleTokenSchema;
  });

  if (decoded.iss !== 'https://appleid.apple.com') {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 7,
      humanMessage: 'Invalid OAuth token',
    });
  }

  if (decoded.aud !== config.AppBundleId) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 8,
      humanMessage: 'Invalid OAuth token',
    });
  }

  // #endregion
  // #region Get the user if they exist, otherwise register them
  const existingUser = await User.findOne({ email: decoded.email });

  if (!existingUser && (!fullName?.givenName || !fullName?.familyName)) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 9,
      humanMessage: 'Full name is required for new users',
    });
  }

  const user = await errorWrapper(10, async () => {
    // If the user already exists, return them
    if (existingUser) return existingUser;

    return User.create({
      email: decoded.email,
      firstName: fullName?.givenName,
      lastName: fullName?.familyName,
    });
  });

  if (!user.calendars.length) {
    const personalCalendar = await Calendar.create({
      name: 'Personal Calendar',
      description: 'Your personal calendar',
      color: '#039dfc',
    });

    user.calendars.push(new Types.ObjectId(personalCalendar._id));
    await user.save();
  }

  // #endregion
  // #region Create tokens and return the user
  const sanitizedUser = user.sanitize();
  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();

  const response: Response = {
    data: {
      accessToken,
      refreshToken,
      user: sanitizedUser,
    },
  };

  return response;
};
