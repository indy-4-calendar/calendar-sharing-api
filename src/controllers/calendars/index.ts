import { Request, Response } from 'express';

import getCalendars from './get';
import postCalendars from './post';
import getCalendar from './id/get';

import handleRequest from '@/lib/request';

export default {
  getCalendars: (req: Request, res: Response) =>
    handleRequest(req, res, getCalendars, 'calendars', 'getCalendars'),
  postCalendars: (req: Request, res: Response) =>
    handleRequest(req, res, postCalendars, 'calendars', 'postCalendars'),
  getCalendar: (req: Request, res: Response) =>
    handleRequest(req, res, getCalendar, 'calendars', 'getCalendar'),
};
