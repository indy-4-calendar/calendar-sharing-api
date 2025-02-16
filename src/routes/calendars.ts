import express from 'express';

import calendarsController from '@/controllers/calendars';

// Route: /api/v1/calendars
const calendarsRouter = express.Router();

/** Get the currently signed in calendars */
calendarsRouter.get('/', calendarsController.getCalendars);

/** Create a new calendar */
calendarsRouter.post('/', calendarsController.postCalendars);

/** Get a specific calendar */
calendarsRouter.get('/:id', calendarsController.getCalendar);

/** Join a specific calendar */
calendarsRouter.post('/:id', calendarsController.postCalendar);

/** Create a new event in a calendar */
calendarsRouter.post('/:id/events', calendarsController.postEvent);

/** Update an event in a calendar */
calendarsRouter.put('/:id/events', calendarsController.putEvent);

/** Delete an event in a calendar */
calendarsRouter.delete('/:id/events', calendarsController.deleteEvent);

export default calendarsRouter;
