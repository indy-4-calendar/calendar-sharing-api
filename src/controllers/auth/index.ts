import { Request, Response } from 'express';

import postApple from './apple/post';
import postLogout from './logout/post';
import postRefresh from './refresh/post';

import handleRequest from '@/lib/request';

export default {
  postApple: (req: Request, res: Response) =>
    handleRequest(req, res, postApple, 'auth', 'postApple'),
  postLogout: (req: Request, res: Response) =>
    handleRequest(req, res, postLogout, 'auth', 'postLogout'),
  postRefresh: (req: Request, res: Response) =>
    handleRequest(req, res, postRefresh, 'auth', 'postRefresh'),
};
