import { Request, Response } from 'express';

import getCalendars from './get';
import postCalendars from './post';
import getCalendar from './id/get';
import postCalendar from './id/post';

import postEvent from './id/events/post';
import putEvent from './id/events/put';
import deleteEvent from './id/events/delete';

import handleRequest from '@/lib/request';

export default {
  getCalendars: (req: Request, res: Response) =>
    handleRequest(req, res, getCalendars, 'calendars', 'getCalendars'),
  postCalendars: (req: Request, res: Response) =>
    handleRequest(req, res, postCalendars, 'calendars', 'postCalendars'),
  getCalendar: (req: Request, res: Response) =>
    handleRequest(req, res, getCalendar, 'calendars', 'getCalendar'),
  postEvent: (req: Request, res: Response) =>
    handleRequest(req, res, postEvent, 'calendars', 'postEvent'),
  putEvent: (req: Request, res: Response) =>
    handleRequest(req, res, putEvent, 'calendars', 'putEvent'),
  deleteEvent: (req: Request, res: Response) =>
    handleRequest(req, res, deleteEvent, 'calendars', 'deleteEvent'),
  postCalendar: (req: Request, res: Response) =>
    handleRequest(req, res, postCalendar, 'calendars', 'postCalendar'),
};
