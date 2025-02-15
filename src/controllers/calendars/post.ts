import { z } from 'zod';
import { Types } from 'mongoose';
import { Request } from 'express';

import Calendar from '@/models/calendar';
import validators from '@/lib/validators';
import { IResponse } from '@/lib/request';
import { ICalendar } from '@/models/@types';
import { APIError, errorWrapper } from '@/lib/error';

type Response = IResponse<{
  calendar: ICalendar;
}>;

/**
 * Endpoint:     POST /api/v1/calendars
 * Description:  Create a new calendar
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const schema = z.object({
    name: validators.string,
    description: validators.string,
    color: validators.color,
  });

  const params = schema.safeParse(req.body);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const data = params.data;

  const calendar = await errorWrapper(2, () => {
    return Calendar.create({
      name: data.name,
      description: data.description,
      color: data.color,
    });
  });

  await errorWrapper(3, () => {
    user.calendars.push(new Types.ObjectId(calendar._id));
    return user.save();
  });

  const response: Response = {
    data: {
      calendar,
    },
  };

  return response;
};
