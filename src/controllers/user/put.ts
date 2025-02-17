import { z } from 'zod';
import { Request } from 'express';

import { APIError } from '@/lib/error';
import { IResponse } from '@/lib/request';
import { ISanitizedUser } from '@/models/@types';

type Response = IResponse<{
  user: ISanitizedUser;
}>;

/**
 * Endpoint:     PUT /api/v1/user
 * Description:  Update the user's notification push token
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    notificationPushToken: z.string().max(256).optional(),
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  if (params.data.notificationPushToken) {
    user.notificationPushToken = params.data.notificationPushToken;
    await user.save();
  }

  const sanitizedUser = user.sanitize();

  const response: Response = {
    data: {
      user: sanitizedUser,
    },
  };

  return response;
};
