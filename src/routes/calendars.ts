import express from 'express';

import calendarsController from '@/controllers/calendars';

// Route: /api/v1/calendars
const calendarsRouter = express.Router();

/** Get the currently signed in calendars */
calendarsRouter.get('/', calendarsController.getCalendars);

export default calendarsRouter;
