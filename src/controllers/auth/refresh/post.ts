import { Request } from 'express';

import { IResponse } from '@/lib/request';
import { errorWrapper } from '@/lib/error';

type Response = IResponse<{
  accessToken: string;
}>;

/**
 * Endpoint:     POST /api/v1/auth/refresh
 * Description:  Refresh an access token using a refresh token
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const accessToken = await errorWrapper(0, () => {
    return user.createAccessToken();
  });

  const response: Response = {
    data: {
      accessToken,
    },
  };

  return response;
};
