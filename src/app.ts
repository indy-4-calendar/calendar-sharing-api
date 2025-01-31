import cors from 'cors';
import helmet from 'helmet';
import express, { Request } from 'express';

import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';

import authMiddleware from '@/middleware/auth';
import loggingMiddleware from '@/middleware/logging';
import { APIError, ErrorHandler } from '@/lib/error';

const app: express.Application = express();

// Middleware
app.use(loggingMiddleware.logRequest);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Heartbeat Route
app.get('/', (_, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Consumer Routes without 'general' middleware. ALL routes here
// MUST implement all of their own middleware including auth, rate limits, etc.
app.use('/api/v1/auth', authRouter);

// Consumer Routes with auth, tracking, rate limits, etc. all in one stack
const middleware = [authMiddleware.authenticateToken()];

app.use('/api/v1/user', middleware, userRouter);

// Catch all 404 errors
app.use((req: Request, res: express.Response) => {
  const errorHandler = new ErrorHandler({
    res,
    fileName: __filename,
    methodName: 'use',
  });

  const error = new APIError({
    type: 'NOT_FOUND',
    traceback: 1,
    humanMessage: `Route ${req.url} not found`,
  });

  errorHandler.handle(error);
});

// Fallback error handler, prevents server crashes
app.use((_: Request, res: express.Response) => {
  const errorHandler = new ErrorHandler({
    res,
    fileName: __filename,
    methodName: 'use',
  });

  const error = new APIError({
    type: 'INTERNAL_SERVER_ERROR',
    traceback: 2,
  });

  errorHandler.handle(error);
});

export default app;
