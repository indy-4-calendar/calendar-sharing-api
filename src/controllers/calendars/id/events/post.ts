import { z } from 'zod';
import { Types } from 'mongoose';
import { Request } from 'express';

import Event from '@/models/event';
import { IEvent } from '@/models/@types';
import Calendar from '@/models/calendar';
import { IResponse } from '@/lib/request';
import validators from '@/lib/validators';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{
  event: IEvent;
}>;

/**
 * Endpoint:     POST /api/v1/calendars/:id
 * Description:  Add an event to a calendar
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    id: validators.objectId,
    name: validators.string,
    description: validators.string,
    color: validators.color,
    date: validators.date,
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
    return Event.create({
      calendar: id,
      name: params.data.name,
      description: params.data.description,
      color: params.data.color,
      date: new Date(params.data.date),
    });
  });

  const response: Response = {
    data: {
      event,
    },
  };

  return response;
};
