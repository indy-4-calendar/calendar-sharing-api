import { z } from 'zod';
import { Request, Response } from 'express';

import { APIError } from '@/lib/error';
import validators from '@/lib/validators';

/**
 * Endpoint:     GET /api/v1/redirect
 * Description:  Redirect a user to a deeplink
 */
export default async (req: Request, res: Response) => {
  const schema = z.object({
    id: validators.objectId,
  });

  const params = schema.safeParse(req.query);

  if (params.success === false) {
    throw new APIError({
      traceback: 1,
      type: 'BAD_REQUEST',
      error: params.error,
    });
  }

  res.redirect(`daylink://link/${params.data.id}`);
};
