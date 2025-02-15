import { Request } from 'express';

import Calendar from '@/models/calendar';
import { IResponse } from '@/lib/request';
import { errorWrapper } from '@/lib/error';
import { ICalendar } from '@/models/@types';

type Response = IResponse<{
  calendars: ICalendar[];
}>;

/**
 * Endpoint:     GET /api/v1/calendars
 * Description:  Get the currently logged in user's calendars
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;

  const calendars = await errorWrapper(1, () => {
    return Calendar.find({
      _id: { $in: user.calendars },
    });
  });

  const response: Response = {
    data: {
      calendars,
    },
  };

  return response;
};
