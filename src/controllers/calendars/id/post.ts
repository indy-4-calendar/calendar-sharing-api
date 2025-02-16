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
 * Endpoint:     POST /api/v1/calendars/:id
 * Description:  Join a calendar from a new account
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

  if (user.calendars.includes(id)) {
    throw new APIError({
      type: 'BAD_REQUEST',
      traceback: 2,
      error: `You are already a member of this calendar`,
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

  const events = await errorWrapper(4, () => {
    return Event.find({ calendar: id });
  });

  await errorWrapper(5, () => {
    user.calendars.push(id);
    return user.save();
  });

  const response: Response = {
    data: {
      calendar,
      events,
    },
  };

  return response;
};
