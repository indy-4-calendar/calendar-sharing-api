import { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger';

/**
 * For every request, log how long the request took to complete
 * and its status code
 */
const logRequest = async (req: Request, res: Response, next: NextFunction) => {
  const url = req.url;
  const method = req.method;
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(0);
    logger.http(`[${res.statusCode}] (${durationMs}ms)  ${method} ${url}`);
  });

  next();
};

export default { logRequest };
