import express from 'express';

import redirectController from '@/controllers/redirect';

// Route: /api/v1/redirect
const redirectRouter = express.Router();

/** Redirect a user to a deeplink */
redirectRouter.get('/', redirectController.getRedirect);

export default redirectRouter;
