import { z } from 'zod';
import { Types } from 'mongoose';
import { Request } from 'express';

import Event from '@/models/event';
import Calendar from '@/models/calendar';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import { ICalendar, IEvent } from '@/models/@types';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{
  calendar: ICalendar;
  events: IEvent[];
}>;

/**
 * Endpoint:     GET /api/v1/calendars/:id
 * Description:  Get a calendar and its events
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    id: validators.objectId,
  });

  const params = schema.safeParse(req.params);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const id = new Types.ObjectId(params.data.id);

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

  const events = await errorWrapper(4, () => {
    return Event.find({ calendar: id });
  });

  const response: Response = {
    data: {
      calendar,
      events,
    },
  };

  return response;
};
