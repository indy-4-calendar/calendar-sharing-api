import express from 'express';

import authMiddleware from '@/middleware/auth';
import authController from '@/controllers/auth';
import { TokenType } from '@/middleware/auth/authenticate-token';

// Route: /api/v1/auth
const authRouter = express.Router();

/** Login or register using apple oauth */
authRouter.post('/apple', authController.postApple);

/** Refresh an access token using a refresh token */
authRouter.post(
  '/refresh',
  authMiddleware.authenticateToken(TokenType.Refresh),
  authController.postRefresh,
);

/** Logout via refresh token */
authRouter.post(
  '/logout',
  authMiddleware.authenticateToken(TokenType.Refresh),
  authController.postLogout,
);

export default authRouter;
