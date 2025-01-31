import { NextFunction, Request, Response } from 'express';

import authenticateToken, { TokenType } from './authenticate-token';

export default {
  authenticateToken: (token: TokenType = TokenType.Access) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      return authenticateToken(req, res, next, token);
    };
  },
};
