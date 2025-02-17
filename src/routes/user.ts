import express from 'express';

import userController from '@/controllers/user';

// Route: /api/v1/user
const userRouter = express.Router();

/** Get the currently signed in user */
userRouter.get('/', userController.getUser);

/** Update the currently signed in user */
userRouter.put('/', userController.updateUser);

export default userRouter;
