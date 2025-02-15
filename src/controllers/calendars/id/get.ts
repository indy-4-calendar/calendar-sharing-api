import { Request } from 'express';

import { IResponse } from '@/lib/request';

type Response = IResponse<{}>;

/**
 * Endpoint:     GET /api/v1/user
 * Description:  Get the currently logged in user
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;
  const sanitizedUser = user.sanitize();

  const response: Response = {
    data: {},
  };

  return response;
};
