import express from 'express';

import userController from '@/controllers/user';

// Route: /api/v1/user
const userRouter = express.Router();

/** Get the currently signed in user */
userRouter.get('/', userController.getUser);

export default userRouter;
