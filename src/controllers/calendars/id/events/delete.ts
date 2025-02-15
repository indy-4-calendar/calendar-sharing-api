import { z } from 'zod';
import { Types } from 'mongoose';
import { Request } from 'express';

import Event from '@/models/event';
import Calendar from '@/models/calendar';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{}>;

/**
 * Endpoint:     DELETE /api/v1/calendars/:id/events
 * Description:  Delete an event from a calendar
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    id: validators.objectId,
    event: validators.objectId,
  });

  const params = schema.safeParse({ ...req.params, ...req.body });

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const id = new Types.ObjectId(params.data.id);
  const eventID = new Types.ObjectId(params.data.event);

  if (!user.calendars.includes(id)) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 2,
      error: `Calendar with id ${id} not found`,
    });
  }

  const calendar = await errorWrapper(3, () => {
    return Calendar.findById(id);
  });

  if (!calendar) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 3,
      error: `Calendar with id ${id} not found`,
    });
  }

  const event = await errorWrapper(4, () => {
    return Event.findOne({ _id: eventID, calendar: id });
  });

  if (!event) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 4,
      error: `Event with id ${eventID} not found in calendar with id ${id}`,
    });
  }

  await errorWrapper(5, () => {
    return event.deleteOne();
  });

  const response: Response = {
    data: {},
  };

  return response;
};
