import { Request } from 'express';

import { IResponse } from '@/lib/request';
import { errorWrapper } from '@/lib/error';

type Response = IResponse<{}>;

/**
 * Endpoint:     POST /api/v1/auth/logout
 * Description:  Logout of an account, removing refresh token
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  await errorWrapper(0, () => {
    user.refreshToken = undefined;
    user.notificationPushTokens = [];
    return user.save();
  });

  const response: Response = {
    data: {},
  };

  return response;
};
