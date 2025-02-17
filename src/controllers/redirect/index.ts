import { Request, Response } from 'express';

import getRedirect from './get';

import { ErrorHandler } from '@/lib/error';

export default {
  getRedirect: (req: Request, res: Response) => {
    try {
      getRedirect(req, res);
    } catch (err) {
      const errorHandler = new ErrorHandler({
        res,
        fileName: 'redirect',
        methodName: 'getRedirect',
      });

      errorHandler.handle(err);
    }
  },
};
