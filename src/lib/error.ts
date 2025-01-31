import express from 'express';

import logger from '@/lib/logger';

export interface IError {
  type: keyof typeof ErrorType;
  traceback: number;
  field?: string;
  statusCode?: number;
  humanMessage?: string;
  error?: any;
}

export interface IErrorHandler {
  fileName: string;
  methodName: string;
  res: express.Response;
}

export const ErrorType = {
  BAD_REQUEST: {
    statusCode: 400,
    humanMessage: 'Bad request',
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    humanMessage: 'An internal error occurred, please try again later',
  },
  INVALID_FIELDS: {
    statusCode: 400,
    humanMessage: 'Invalid input',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    humanMessage: 'Unauthorized',
  },
  EXPIRED_TOKEN: {
    statusCode: 401,
    humanMessage: 'Your access token has expired. Please log in again.',
  },
  NOT_FOUND: {
    statusCode: 404,
    humanMessage: 'Not found',
  },
  RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    humanMessage: 'Rate limit exceeded',
  },
};

export const errorWrapper = async <T>(
  traceback: number,
  fn: () => Promise<T>,
) => {
  try {
    const res = await fn();
    return res;
  } catch (error) {
    throw new APIError({
      type: 'INTERNAL_SERVER_ERROR',
      traceback: traceback,
      error: error,
    });
  }
};

export class APIError implements IError {
  public type: keyof typeof ErrorType;
  public traceback: number;
  public field?: string;
  public statusCode?: number;
  public humanMessage?: string;
  public error?: any;

  constructor(input: IError) {
    this.type = input.type;
    this.traceback = input.traceback;
    this.field = input.field;
    this.statusCode = input.statusCode;
    this.humanMessage = input.humanMessage;
    this.error = input.error;
  }
}

export class ErrorHandler implements IErrorHandler {
  private _fileName: string;
  private _methodName: string;
  private _res: express.Response;

  constructor(input: IErrorHandler) {
    this._methodName = input.methodName;
    this._res = input.res;

    // Removes a full path from the file name
    if (typeof input.fileName === 'string') {
      // If filename doesnt have any special characters, set it as the filename
      if (!input.fileName.includes('/') && !input.fileName.includes('\\')) {
        this._fileName = input.fileName;
        return;
      }

      // Use a regular expression to split the path based on both forward and backward slashes
      const fileNameWithoutPath = input.fileName.split(/[\\/]/).pop() || '';

      // Split the file name by '.' and remove the last part (extension)
      const fileNameWithoutExtension = fileNameWithoutPath
        .split('.')
        .slice(0, -1)
        .join('.');

      // Check if the resulting file name is not empty
      if (fileNameWithoutExtension.trim() !== '') {
        // Set the file name without path and extension
        this._fileName = fileNameWithoutExtension;
      } else {
        // Set the file name to unknown
        this._fileName = 'unknown';
      }
    } else {
      this._fileName = 'unknown';
    }
  }

  public get fileName() {
    return this._fileName;
  }

  public get methodName() {
    return this._methodName;
  }

  public get res() {
    return this._res;
  }

  /**
   * Handle errors
   */
  public handle(error: any) {
    // If the error type is known, handle it
    if (error instanceof APIError) {
      const errorData = ErrorType[error.type];

      const statusCode = error.statusCode || errorData.statusCode;

      if (statusCode >= 500) {
        if (error.error) {
          console.error(error.error);
          logger.error(error.error);
        }
      }

      // If the error is a INVALID_FIELDS error, try and return the arrays first object's 'path' arrays first object
      // This is to handle a "ZodError" error, which is thrown by the zod library when a validation fails
      error.field =
        error.field ||
        (error.type === 'INVALID_FIELDS'
          ? error.error?.issues?.[0].path[0] || undefined
          : undefined);

      error.humanMessage =
        error.humanMessage ||
        (error.type === 'INVALID_FIELDS'
          ? error.error?.issues?.[0].message || undefined
          : undefined);

      const humanMessage = error.humanMessage || errorData.humanMessage;

      // Return the error
      return this._res.status(statusCode).json({
        error: {
          field: error.field,
          traceback: `${this._fileName}.${this._methodName}.${error.traceback}`,
          message: error.type,
          humanMessage: humanMessage,
        },
      });
    }

    // Else, handle the error as an unknown error (internal server error)
    // Create a new error object
    const unknownError = new APIError({
      type: 'INTERNAL_SERVER_ERROR',
      traceback: -1,
      error: error,
    });

    // Recursively call this function (will only be called once again, because we are now handling a known error)
    return this.handle(unknownError);
  }
}
