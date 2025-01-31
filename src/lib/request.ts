import { Request, Response } from 'express';

import { ErrorHandler, IError } from '@/lib/error';

export interface IResponse<T> {
  error?: IError;
  data: T;
}

/**
 * Handles ALL Requests by creating an 'error handling' wrapper.
 * For ALL API errors, we THROW an error and then let our custom
 * error handler take care of the response
 */
const handleRequest = async (
  req: Request,
  res: Response,
  handlerFunction: Function,
  fileName: string,
  methodName: string,
) => {
  try {
    const data = await handlerFunction(req);
    res.status(200).json(data);
    return;
  } catch (err) {
    const errorHandler = new ErrorHandler({
      res,
      fileName,
      methodName,
    });

    errorHandler.handle(err);
  }
};

export default handleRequest;
